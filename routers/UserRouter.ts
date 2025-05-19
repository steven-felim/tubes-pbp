import express, { Request, Response } from "express";
import { User } from "../models/User";
import { loadCurrentUser } from "../middlewares/loadCurrentUser";
import { authenticate } from "../controller/Authorization";

export const userRouter = express.Router();

type AuthenticatedRequest = Request & { user?: { id: string }, dbUser?: User };

userRouter.get("/me", authenticate, loadCurrentUser, (req: AuthenticatedRequest, res: Response) => {
    res.json(req.dbUser);
});

userRouter.put("/me", authenticate, loadCurrentUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { username, bio } = req.body;
        await req.dbUser!.update({ username, bio });
        res.json(req.dbUser);
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});

userRouter.delete("/me", authenticate, loadCurrentUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        await req.dbUser!.destroy();
        res.status(204).send();
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});

userRouter.get("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});
