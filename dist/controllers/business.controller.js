"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const business_model_1 = __importDefault(require("../models/business.model"));
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const SALT_ROUNDS = 10;
async function getBusiness(req, res) {
    let page = parseInt(req.query.page) || 0;
    if (page < 1) {
        page = 1;
    }
    try {
        const business = await business_model_1.default.find()
            .skip((page - 1) * 10)
            .limit(10);
        res.status(201).json({ business });
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = { getBusiness };