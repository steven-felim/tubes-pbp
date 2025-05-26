import express, { Request, Response } from "express";
import { User } from "../models/User";

export const SessionRouter = express.Router();

// Register without hashing
SessionRouter.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await User.create({ name, email, password }); // plain text
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
});

// Login check with plain-text comparison
SessionRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // For simplicity, we’ll just use a basic cookie
    res
      .cookie("user_id", user.id, { httpOnly: true, sameSite: "lax" })
      .json({ message: "Logged in", user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

// Sign out
SessionRouter.post("/signout", (_req, res) => {
  res.clearCookie("user_id").json({ message: "Signed out" });
});
