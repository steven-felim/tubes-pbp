import express, { Request, Response } from "express";
import { User } from "../models/User";
import { authenticate } from "../controller/Authorization";

export const userRouter = express.Router();

userRouter.get("/me", authenticate , async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = await User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});


userRouter.get("/:id", authenticate , async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});

userRouter.put("/me", authenticate, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const { username, bio } = req.body;
        await user.update({ username, bio });
        res.json(user);
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});
    
userRouter.delete("/me", authenticate, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        await user.destroy();
        res.status(204).send();
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});