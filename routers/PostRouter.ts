import express from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";

export const postRouter = express.Router({ mergeParams: true });

postRouter.get("/", async (req, res) => {
  const { threadId } = req.query;

  try {
    const posts = threadId
      ? await Post.findAll({
          where: { threadId },
          include: [{ model: User, attributes: ["name"] }],
          order: [["createdAt", "ASC"]],
        })
      : await Post.findAll({
          include: [{ model: User, attributes: ["name"] }],
          order: [["createdAt", "ASC"]],
        });

    const postsWithNames = posts.map((post) => ({
      id: post.id,
      content: post.content,
      userId: post.userId,
      name: post.user?.name ?? "Anonymous",
      refId: post.refId,
      threadId: post.threadId,
    }));

    res.status(200).json(postsWithNames);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

postRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
    }
    res.status(200).json(post);
});

postRouter.post("/", authorizationMiddleware, async (req, res) => {
  try {
    const { content, refId } = req.body;
    const { threadId } = req.params;
    const userId = res.locals.user?.id;

    if (!userId || !threadId) {
      res.status(400).json({ error: "Missing user or thread ID" });
      return;
    }

    const post = await Post.create({ content, refId, threadId, userId });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

postRouter.put("/:id", authorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const user = res.locals.user;
    const post = await Post.findByPk(id);

    if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
    }

    if (post.userId !== user.id) {
        res.status(403).json({ error: "You are not allowed to edit this post" });
        return;
    }

    try {
        await post.update({ content });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

postRouter.delete("/:id", authorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    const user = res.locals.user;

    if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
    }

    if (post.userId !== user.id) {
        res.status(403).json({ error: "You are not allowed to delete this post" });
        return;
    }

    try {
        await post.destroy();
        res.status(200).send();
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});