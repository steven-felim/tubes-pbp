import express from "express";
import { Thread } from "../models/Thread";

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

threadRouter.post("/", async (req, res) => {
    const project = await Thread.create(req.body);
    res.status(201).json(project);
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