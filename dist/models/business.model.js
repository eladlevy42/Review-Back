"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const businessSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stars: { type: String, default: 0 },
}, {
    timestamps: true,
});
const Business = (0, mongoose_1.model)("Business", businessSchema);
exports.default = Business;
