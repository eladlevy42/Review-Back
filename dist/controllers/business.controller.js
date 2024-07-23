"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusiness = getBusiness;
exports.createBusiness = createBusiness;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const business_model_1 = __importDefault(require("../models/business.model"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
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
const upload = (0, multer_1.default)({ dest: "uploads/" });
async function createBusiness(req, res) {
    const businessData = req.body;
    upload.single("image");
    try {
        if (req.file) {
            const result = await cloudinary_1.v2.uploader.upload(req.file.path);
            businessData.imageUrl = result.secure_url;
            fs_1.default.unlinkSync(req.file.path); // Remove the file from the local storage after uploading to Cloudinary
        }
        const newBusiness = new business_model_1.default(businessData);
        await newBusiness.save();
        res
            .status(200)
            .json({ message: "New Business Saved Successfully", newBusiness });
    }
    catch (err) {
        res
            .status(400)
            .json({ error: "Create new Business failed", message: err.message });
    }
}
