import express from "express";
import { Thread } from "../models/Thread";
import { Category } from "../models/Category";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";

export const threadRouter = express.Router();

threadRouter.get("/", async (_req, res) => {
  try {
    const threads = await Thread.findAll({ include: [Category] });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

threadRouter.get("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findByPk(categoryId, {
      include: [Thread],
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json(category.threads);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

threadRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Thread.findByPk(id, { include: [Category] });
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

threadRouter.post("/", authorizationMiddleware, async (req, res) => {
  const { title, content, categoryIds } = req.body; // categoryIds = array of category names (e.g., ["General", "DevOps"])
  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const thread = await Thread.create({
      title,
      content,
      userId: user.id,
    });

    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      const categories = await Promise.all(
        categoryIds.map(async (name: string) => {
          const [category] = await Category.findOrCreate({ where: { name } });
          return category;
        })
      );

      await thread.$set("categories", categories);
    }

    const fullThread = await Thread.findByPk(thread.id, {
      include: [Category],
    });

    res.status(201).json(fullThread);
  } catch (err) {
    console.error("Thread creation error:", err);
    res.status(500).json({ error: "Failed to create thread." });
  }
});

threadRouter.put("/:id", authorizationMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const thread = await Thread.findByPk(id);
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    await thread.update({ content });
    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

threadRouter.delete("/:id", authorizationMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const thread = await Thread.findByPk(id);
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    await thread.destroy();
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
