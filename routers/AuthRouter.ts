import { Router } from "express";
import { v4 } from "uuid";
import { users, User } from "../config/data";
import { Session } from "../models/Session";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";

export const authRouter = Router();

authRouter.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return next(new Error("User already exists"));
  }

  const newUser: User = {
    id: v4(),
    name,
    email,
    password,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

authRouter.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return next(new Error("Invalid credentials"));
    }

    const session = await Session.create({
      id: v4(),
      userId: user.id,
      createdAt: new Date(),
    });

    res.cookie("sessionId", session.id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/signout", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    await Session.destroy({ where: { id: sessionId } });
    res.clearCookie("sessionId");
  }

  res.status(200).json({ message: "Logout successful" });
});

authRouter.get("/me", authorizationMiddleware, (req, res, next) => {
  res.status(200).json(res.locals.user.user);
  next();
});