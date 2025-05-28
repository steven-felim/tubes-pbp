import express from "express";
import { Post } from "../models/Post";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";

export const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
    const { threadId } = req.query;
    const posts = threadId
        ? await Post.findAll({ where: { threadId } })
        : await Post.findAll();
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

postRouter.post("/", authorizationMiddleware, async (req, res) => {
    const project = await Post.create(req.body);
    res.status(201).json(project);
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