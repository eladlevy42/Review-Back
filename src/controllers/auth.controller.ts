import { Request, Response } from "express";
import { Document } from "mongoose";

const User = require("../models/user.model").default; // Ensure .default is used
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

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
      console.log("username already exists");
      return res.status(400).json({ error: "User already exists" });
    }
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
}

async function login(req: LoginRequest, res: Response) {
  try {
    const { username, password } = req.body;

    const user = (await User.findOne({ username })) as UserDocument | null;
    if (!user) {
      return res.status(401).json({ error: "No Registered username" });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Wrong Password" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    console.log("loggedIn");
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Login failed" });
  }
}

async function getUserByToken() {}

export { register, login };
