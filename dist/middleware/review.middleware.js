"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const business_model_1 = __importDefault(require("../models/business.model"));
async function verifyBusiness(req, res, next) {
    const { id } = req.params;
    console.log(id);
    try {
        const business = await business_model_1.default.findById(id);
        if (!business) {
            return res.status(404).json({ Error: "business not found" });
        }
        if (typeof id === "string") {
            req.businessId = id;
            next();
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
}
module.exports = { verifyBusiness };
