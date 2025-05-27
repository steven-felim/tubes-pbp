import express, { Request, Response } from "express";
import { User } from "../models/User";
import { loadCurrentUser } from "../middlewares/loadCurrentUser";

export const userRouter = express.Router();

type AuthenticatedRequest = Request & { user?: { id: string }, dbUser?: User };

userRouter.put("/me", loadCurrentUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.dbUser) {
      res.status(401).json({ error: "Unauthorized" });
      return
    }

    const { name, email } = req.body;

    if ((name && typeof name !== "string") || (email && typeof email !== "string")) {
      res.status(400).json({ error: "Invalid input data" });
      return
    }

    if (email && email !== req.dbUser.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }
    }

    await req.dbUser.update({ name, email });
  } catch (error) {
    console.error("PUT /me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.delete("/me", loadCurrentUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.dbUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await req.dbUser.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("DELETE /me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("GET /:id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});