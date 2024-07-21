"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    business: { type: mongoose_1.Schema.Types.ObjectId, ref: "Business", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    stars: { type: String, required: true, ref: "Stars", default: "3" },
    likes: { type: [mongoose_1.Schema.Types.ObjectId], default: [] },
});
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
