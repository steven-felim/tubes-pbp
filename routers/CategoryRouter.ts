import express from "express";
import { Thread } from "../models/Thread";

export const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
    const threads = await Thread.findAll();
    res.status(200).json(threads);
});

categoryRouter.post("/", async (req, res) => {
    const project = await Thread.create(req.body);
    res.status(201).json(project);
});