import express from "express";
import { User } from "../models/User";
import { Op } from "sequelize";
import { authenticate } from "../controller/Authorization";

export const userRouter = express.Router();

// Get my own profile
userRouter.get("/me", authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get other people's profile
userRouter.get("/:id", authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Edit my own profile
userRouter.put("/me", authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.update(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete my own user
userRouter.delete("/me", authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});