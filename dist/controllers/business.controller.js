"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const business_model_1 = __importDefault(require("../models/business.model"));
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const SALT_ROUNDS = 10;
async function getBusiness(req, res) {
    let page = parseInt(req.query.page) || 1;
    const name = req.query.name;
    const category = req.query.category;
    const minRating = parseFloat(req.query.minRating) || 0;
    const query = {};
    if (name) {
        query.name = { $regex: name, $options: "i" }; // Case-insensitive regex search
    }
    if (category) {
        query.category = category;
    }
    if (minRating) {
        query.stars = { $gte: minRating };
    }
    try {
        const totalBusinesses = await business_model_1.default.countDocuments(query);
        const business = await business_model_1.default.find(query)
            .skip((page - 1) * 5)
            .limit(5);
        res.status(200).json({ business, totalBusinesses });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: err.message });
    }
}
exports.default = getBusiness;
async function createBusiness(req, res) {
    const business = req.body;
    try {
        const newBusiness = new business_model_1.default(business);
        await newBusiness.save();
        res.status(200).json({ message: "new Business Saved Succesfully" });
    }
    catch (err) {
        return res.status(400).json({ error: "Create new Business failed" });
    }
}
module.exports = { getBusiness, createBusiness };
