import { Router } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";
import { User } from "../models/User";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
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
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/signin", async (req, res) => {
  console.log("Signin attempt:", req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "User not found" });
    } else if (user.password !== password) {
      res.status(401).json({ message: "Wrong password" });
    } else {
      const token = jwt.sign(
        { userId: user.id },
        appConfig.jwtSecret,
        { expiresIn: appConfig.jwtExpiry }
      );
      console.log("User signed in:", user.email);
      res.status(200).json({ message: "Login successful", token });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/signout", (req, res, next) => {
  // Invalidate the token on the client side
  req.headers.authorization = undefined;
  res.status(200).json({ message: "Logout successful" });
  next();
});