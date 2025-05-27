import express, { Request, Response } from "express";
import { User } from "../models/User";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";

export const userRouter = express.Router();

userRouter.get("/me", authorizationMiddleware, async (req, res) => {
  const user = res.locals.user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

userRouter.put("/me", authorizationMiddleware, async (req: Request, res: Response) => {
  try {
    const dbUser = res.locals.user as User;

    const { name, email } = req.body;

    if ((name && typeof name !== "string") || (email && typeof email !== "string")) {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    if (email && email !== dbUser.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }
    }

    await dbUser.update({ name, email });

    res.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    });
  } catch (error) {
    console.error("PUT /me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.delete("/me", authorizationMiddleware, async (req: Request, res: Response) => {
  try {
    const dbUser = res.locals.user as User;

    await dbUser.destroy();
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
    return
  } catch (error) {
    console.error("GET /:id error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});
