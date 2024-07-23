"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const businessSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.ObjectId },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stars: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
});
const Business = (0, mongoose_1.model)("Business", businessSchema);
exports.default = Business;
