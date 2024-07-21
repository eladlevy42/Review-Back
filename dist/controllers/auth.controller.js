"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const User = require("../models/user.model").default; // Ensure .default is used
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;
async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        console.log("registered");
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        if (err.code === 11000) {
            console.log("username already exists");
            return res.status(400).json({ error: "User already exists" });
        }
        console.log(err);
        res.status(500).json({ error: "Registration failed" });
    }
}
async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = (await User.findOne({ username }));
        if (!user) {
            return res.status(401).json({ error: "No Registered username" });
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Wrong Password" });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        console.log("loggedIn");
        res.status(200).json({ token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Login failed" });
    }
}
