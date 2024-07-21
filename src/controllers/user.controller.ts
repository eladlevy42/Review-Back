import { Request, Response } from "express";
import User from "../models/user.model"; // Ensure correct path

interface Req extends Request {
  userId: string;
}

async function getUser(req: Req, res: Response) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: "No matching user" });
    }
    res.status(200).json(user);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
}

export { getUser };
