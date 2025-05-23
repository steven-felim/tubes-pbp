import { Router } from "express";
import { v4 } from "uuid";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";
import { User, users } from "../config/data";

export const authRouter = Router();

authRouter.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  const existingUser = users.find((user) => user.name === username);
  const existingEmail = users.find((user) => user.email === email);
  if (existingEmail) {
    next(new Error("Email already exists"));
    return;
  }
  if (existingUser) {
    next(new Error("User already exists"));
    return;
  }
  const newUser: User = {
    id: v4(),
    name: username,
    email: email,
    password: password,
  };
  users.push(newUser);
  res.status(201).json(newUser);
  next();
});

authRouter.post("/signin", (req, res, next) => {
  const user = users.find(
    (user) =>
      user.name === req.body.name && user.password === req.body.password
  );
  if (!user) {
    next(new Error("Invalid credentials"));
    return;
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    appConfig.jwtSecret,
    {
      expiresIn: appConfig.jwtExpiry,
    }
  );
  res.status(200).json({ message: "Login successful", token });
  next();
});

authRouter.post("/signout", (req, res, next) => {
  // Invalidate the token on the client side
  req.headers.authorization = undefined;
  res.status(200).json({ message: "Logout successful" });
  next();
});

authRouter.get("/me", authorizationMiddleware, (req, res, next) => {
  res.status(200).json(res.locals.user);
  next();
});
