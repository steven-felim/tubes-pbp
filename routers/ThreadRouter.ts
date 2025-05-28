import express from "express";
import { Thread } from "../models/Thread";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { ThreadCategory } from "../models/ThreadCategory";
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
    const thread = await Thread.findByPk(id, {
      include: [
        { model: Category },
        { model: User, attributes: ["name"] },
      ],
    });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    const threadData = {
      id: thread.id,
      title: thread.title,
      content: thread.content,
      name: thread.user.name ?? "Anonymous",
      userId: thread.userId,
      categories: thread.categories.map((cat) => cat.name),
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };

    res.status(200).json(threadData);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

threadRouter.post("/", authorizationMiddleware, async (req, res) => {
  const { title, content, categoryNames } = req.body;
  const user = res.locals.user;
  const userId = user.id;

  if (!title || !content || !categoryNames || !Array.isArray(categoryNames)) {
    res.status(400).json({ error: "Invalid thread data" });
    return;
  }

  try {
    const thread = await Thread.create({
      title,
      content,
      userId,
    });

    for (const name of categoryNames) {
      if (typeof name !== "string") continue;

      const trimmedName = name.trim();
      if (!trimmedName) continue;

      const [category] = await Category.findOrCreate({
        where: { name: trimmedName },
        defaults: { name: trimmedName },
      });

      await ThreadCategory.create({
        threadId: thread.id,
        categoryName: category.name,
      });
    }

    res.status(201).json(thread);
  } catch (err) {
    console.error("Thread creation error:", err);
    res.status(500).json({ error: "Failed to create thread" });
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
