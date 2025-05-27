import { Router } from "express";
import { v4 } from "uuid";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";
import { User, users } from "../config/data";

export const authRouter = Router();

authRouter.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = users.find((user) => user.name === name);
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
    name: name,
    email: email,
    password: password,
  };

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

  users.push(newUser);
  console.log("Incoming signup data:", req.body);
  res.status(201).json(newUser);
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

authRouter.get("/me", authorizationMiddleware, (req, res, next) => {
  res.status(200).json(res.locals.user);
  next();
});
