import { Request, Response } from "express";
import { Document } from "mongoose";
import User from "../models/user.model"; // Ensure correct import
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

const SALT_ROUNDS = 10;

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface RegisterRequest extends Request {
  body: {
    username: string;
    password: string;
    email: string;
  };
}

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

async function register(req: RegisterRequest, res: Response) {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    if (err.code === 11000) {
      console.log("Username already exists");
      return res.status(400).json({ error: "User already exists" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
}

async function login(req: LoginRequest, res: Response) {
  try {
    const { username, password } = req.body;

    const user = (await User.findOne({ username })) as UserDocument | null;
    if (!user) {
      console.log("No registered username");
      return res.status(401).json({ error: "No registered username" });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log("Wrong password");
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("loggedIn");
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
}

export { register, login };