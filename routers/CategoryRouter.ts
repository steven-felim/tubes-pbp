import express from "express";
import { Category } from "../models/Category";

export const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
    const category = await Category.findAll();
    res.status(200).json(category);
});

categoryRouter.post("/", async (req, res) => {
    const project = await Category.create(req.body);
    res.status(201).json(project);
});