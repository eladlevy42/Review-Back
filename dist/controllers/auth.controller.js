"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const user_model_1 = __importDefault(require("../models/user.model")); // Ensure correct import
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
console.log("JWT_SECRET:", JWT_SECRET);
const SALT_ROUNDS = 10;
async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        console.log("Hashed Password:", hashedPassword);
        const user = new user_model_1.default({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        if (err.code === 11000) {
            console.log("Username already exists");
            return res.status(400).json({ error: "User already exists" });
        }
        console.log(err);
        res.status(500).json({ error: "Registration failed" });
    }
}
async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = (await user_model_1.default.findOne({ username }));
        if (!user) {
            console.log("No registered username");
            return res.status(401).json({ error: "No registered username" });
        }
        console.log("Plain password:", password);
        console.log("Hashed password:", user.password);
        const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("Wrong password");
            return res.status(401).json({ error: "Wrong password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        console.log("Token generated:", token);
        console.log("loggedIn");
        res.status(200).json({ token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Login failed" });
    }
}
