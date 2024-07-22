"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
const user_model_1 = require("../models/user.model"); // Ensure correct path
async function getUser(req, res) {
    try {
        const user = await user_model_1.User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ error: "No matching user" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
}
