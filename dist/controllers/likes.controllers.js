"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = __importDefault(require("../models/review.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../index");
async function toggleLike(req, res) {
    const { reviewId } = req.body;
    const { userId } = req;
    // Validate if userId is a valid ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
    }
    const ObjUserId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const review = await review_model_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        const index = review.likes.findIndex((id) => id.equals(ObjUserId));
        if (index !== -1) {
            // If liked, remove the like
            review.likes = review.likes.filter((id) => !id.equals(ObjUserId));
            index_1.io.emit("dislike", ObjUserId);
        }
        else {
            // If not liked, add the like
            review.likes.push(ObjUserId);
            index_1.io.emit("like", ObjUserId);
        }
        const updatedReview = await review.save();
        return res.status(200).json({ "New Review": updatedReview });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
}
exports.default = { toggleLike };
