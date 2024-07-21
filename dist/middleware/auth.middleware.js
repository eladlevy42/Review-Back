"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const review_model_1 = __importDefault(require("../models/review.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
function verifyToken(req, res, next) {
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
        console.log(token);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Verify token
        console.log(decoded.userId);
        req.userId = decoded.userId; // Add userId to request object
        next(); // Call next middleware
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({ error: "Invalid token" });
    }
}
async function verifyUser(req, res, next) {
    const { id: reviewId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid task ID format" });
    }
    const review = await review_model_1.default.findById(reviewId);
    if (!review) {
        return res.status(404).json({ error: "reviewId not found" });
    }
    else if (review.user.toString() !== req.userId) {
        return res.status(403).json({ error: "user not authorized" });
    }
    next();
}
module.exports = { verifyToken, verifyUser };
