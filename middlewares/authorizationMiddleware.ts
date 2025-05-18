import { Request, Response, NextFunction } from "express";
import { Session } from "../models/Session";
import { users } from "../config/data";

export const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({ message: "Unauthorized: No session" });
    return;
  }

  const session = await Session.findByPk(sessionId);

  if (!session) {
    res.status(401).json({ message: "Unauthorized: Invalid session" });
    return;
  }

  const user = users.find((u) => u.id === session.userId);

  if (!user) {
    res.status(401).json({ message: "Unauthorized: User not found" });
    return;
  }

  res.locals.user = user;
  next();
};
