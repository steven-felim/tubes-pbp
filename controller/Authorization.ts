import { v4 as uuidv4 } from "uuid";
import { Session } from "../models/Session"; 
import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
  
  declare module "express-serve-static-core" {
    interface Request {
      user?: User;
    }
  }

export async function login(req: Request & { body: { userId: string } }, res: Response) {
  const { userId } = req.body;
  const sessionId = uuidv4();
  await Session.create({
    id: sessionId,
    userId: userId,
    createdAt: new Date(),
  });

  res.json({ sessionId }); 
}

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.status(401).json({ message: "Authorization header missing" });
        return;
      }
  
      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        res.status(401).json({ message: "Invalid authorization format" });
        return;
      }
  
      const sessionId = tokenParts[1];
      if (!sessionId) {
        res.status(401).json({ message: "Session ID missing" });
        return;
      }
  
      const session = await Session.findOne({
        where: { id: sessionId },
        include: ["user"], 
      });
  
      if (!session) {
        res.status(401).json({ message: "Invalid or expired session" });
        return;
      }
  
      req.user = session.user;
  
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  export async function logout(req: Request, res: Response): Promise<void> {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.status(401).json({ message: "Authorization header missing" });
        return;
      }
    
      const tokenParts = authHeader.split(" ");
      const sessionId = tokenParts[1];
    
      await Session.destroy({
        where: { id: sessionId },
      });
    
      res.json({ message: "Logged out successfully" });
  }