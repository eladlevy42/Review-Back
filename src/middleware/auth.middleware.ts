import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Review from "../models/review.model";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

interface AuthRequest extends Request {
  params: { id: string };
  userId: string;
  io?: SocketIOServer;
  body: { reviewId: string };
}

function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void {
  // Get token from header, the client should be responsible for sending the token
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }; // Verify token

    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error: any) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

async function verifyUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const { id: reviewId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ error: "reviewId not found" });
  } else if (review.user.toString() !== req.userId) {
    return res.status(403).json({ error: "user not authorized" });
  }
  next();
}

export { verifyToken, verifyUser, AuthRequest };
