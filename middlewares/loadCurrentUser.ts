import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

type AuthenticatedRequest = Request & { user?: { id: string }, dbUser?: User };

export async function loadCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  req.dbUser = user;
  next();
}