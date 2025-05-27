import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";
import { User } from "../models/User"; // adjust to your path

export async function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  try {
    const result = jwt.verify(token, appConfig.jwtSecret) as { userId?: string };
    const userId = result.userId;
    if (!userId) {
      res.sendStatus(401);
      return;
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // exclude sensitive fields
    });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    res.locals.user = user;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.sendStatus(401);
    return;
  }
}
