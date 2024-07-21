"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function connectDB() {
    try {
        if (!process.env.MONGO_URI) {
            return;
        }
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
