import express from "express";
import { Post } from "../models/Post";

export const postRouter = express.Router();

postRouter.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    const posts = await Post.findAll({ where: { threadId } });
    res.status(200).json(posts);
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

postRouter.post("/", async (req, res) => {
    const project = await Post.create(req.body);
    res.status(201).json(project);
});

postRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const post = await Post.findByPk(id);
    if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
    }
    try {
        await post.update({ content });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

postRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
    }
    try {
        await post.destroy();
        res.status(200).send();
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


postRouter.put("/:id", async (req, res) => {
  const record = await Post.findByPk(req.params.id);
  if (!record) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  await record.update(req.body);
  res.status(200).json(record);
});

postRouter.delete("/:id", async (req, res) => {
  const record = await Post.findByPk(req.params.id);
  if (!record) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  await record.destroy();
  res.status(200).send();
});