import { Router } from "express";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";
import { users } from "../config/data";
import { User } from "../models/User";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({ name, email, password });

    const token = jwt.sign(
      { userId: newUser.id },
      appConfig.jwtSecret,
      { expiresIn: appConfig.jwtExpiry }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: newUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/signin", (req, res, next) => {
  console.log("Signin attempt:", req.body);

  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    console.log("User not found or wrong password");
    next(new Error("Invalid credentials"));
    return;
  }

  console.log("User found:", user);

  const token = jwt.sign(
      { userId: user.id },
      appConfig.jwtSecret,
      { expiresIn: appConfig.jwtExpiry }
    );

    res.status(200).json({ message: "Login successful", token });
});

authRouter.post("/signout", (req, res, next) => {
  // Invalidate the token on the client side
  req.headers.authorization = undefined;
  res.status(200).json({ message: "Logout successful" });
  next();
});

authRouter.get("/me", authorizationMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email"] // Avoid sending password
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});