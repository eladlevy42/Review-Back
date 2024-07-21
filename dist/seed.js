"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const business_model_1 = __importDefault(require("./models/business.model"));
const review_model_1 = __importDefault(require("./models/review.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const mongoURI = process.env.MONGO_URI || ""; // Fallback to a default URI if not set
console.log(mongoURI);
const seedDatabase = async () => {
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected!");
        // Clear existing data
        await business_model_1.default.deleteMany({});
        await review_model_1.default.deleteMany({});
        await user_model_1.default.deleteMany({});
        // Create users
        const users = [
            {
                username: "elad",
                email: "elad@example.com",
                password: await bcrypt_1.default.hash("elad", 10),
            },
            {
                username: "user2",
                email: "user2@example.com",
                password: await bcrypt_1.default.hash("password2", 10),
            },
        ];
        const createdUsers = await user_model_1.default.insertMany(users);
        // Create businesses
        const businesses = [
            {
                name: "Business One",
                description: "Description for Business One",
            },
            {
                name: "Business Two",
                description: "Description for Business Two",
            },
        ];
        const createdBusinesses = await business_model_1.default.insertMany(businesses);
        // Create reviews
        const reviews = [
            {
                content: "Great service!",
                business: createdBusinesses[0]._id,
                user: createdUsers[0]._id,
                stars: "5",
                likes: [],
            },
            {
                content: "Not bad.",
                business: createdBusinesses[1]._id,
                user: createdUsers[1]._id,
                stars: "3",
                likes: [],
            },
        ];
        await review_model_1.default.insertMany(reviews);
        console.log("Database seeded!");
    }
    catch (err) {
        console.error(err);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
seedDatabase();
