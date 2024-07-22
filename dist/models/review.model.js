"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    business: { type: mongoose_1.Schema.Types.ObjectId, ref: "Business", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    userFullName: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
