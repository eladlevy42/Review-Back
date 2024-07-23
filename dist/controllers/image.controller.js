"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const upload = (0, multer_1.default)({ dest: "uploads/" });
const uploadImage = async (req, res) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(req.file.path);
        fs_1.default.unlinkSync(req.file.path); // Remove the file from the local storage after uploading to Cloudinary
        res.status(200).json({ success: true, imageUrl: result.secure_url });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
