import express from "express";
import { Thread } from "../models/Thread";
import { ThreadCategory } from "../models/ThreadCategory";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";

export const threadRouter = express.Router();

threadRouter.get("/", async (req, res) => {
    const threads = await Thread.findAll();
    res.status(200).json(threads);
});

threadRouter.get("/category/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    try {
        const threads = await Thread.findAll({ where: { categoryId } });
        res.status(200).json(threads);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

threadRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const thread = await Thread.findByPk(id);
    if (!thread) {
        res.status(404).json({ error: "Thread not found" });
        return;
    }
    res.status(200).json(thread);
});

threadRouter.post("/", authorizationMiddleware, async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const user = res.locals.user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const thread = await Thread.create({
      title,
      content,
      userId: user.id,
      categoryIds: categoryIds || [],
    });

    if (categoryIds && Array.isArray(categoryIds)) {
      for (const categoryId of categoryIds) {
        await ThreadCategory.create({
          threadId: thread.id,
          categoryId,
        });
      }
    }

    res.status(201).json(thread);
  } catch (err) {
    console.error("Thread creation error:", err);
    res.status(500).json({ error: "Could not create thread." });
  }
});

threadRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const thread = await Thread.findByPk(id);
    if (!thread) {
        res.status(404).json({ error: "Thread not found" });
        return;
    }
    try {
        await Thread.update({ content }, { where: { id } });
        res.status(200).json(thread);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

threadRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const thread = await Thread.findByPk(id);
    if (!thread) {
        res.status(404).json({ error: "Thread not found" });
        return;
    }
    try {
        await Thread.destroy();
        res.status(200).send();
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});