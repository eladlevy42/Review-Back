"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const business_model_1 = __importDefault(require("./models/business.model"));
const review_model_1 = __importDefault(require("./models/review.model"));
const user_model_1 = require("./models/user.model");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_2 = require("mongoose");
// Load environment variables from .env file
dotenv_1.default.config();
const mongoURI = process.env.MONGO_URI || ""; // Fallback to a default URI if not set
const seedDatabase = async () => {
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected!");
        // Clear existing data
        await business_model_1.default.deleteMany({});
        await review_model_1.default.deleteMany({});
        await user_model_1.User.deleteMany({});
        // Create users
        const userData = [
            {
                fullName: "John Doe",
                email: "john@example.com",
                password: "password123",
            },
            {
                fullName: "Jane Doe",
                email: "jane@example.com",
                password: "password123",
            },
            {
                fullName: "Sam Smith",
                email: "sam@example.com",
                password: "password123",
            },
            {
                fullName: "Lisa Jones",
                email: "lisa@example.com",
                password: "password123",
            },
            {
                fullName: "Yuval Maderer",
                email: "yuval@maderer.com",
                password: "1234",
            },
            {
                fullName: "Elad Levy Wilson",
                email: "elad@levy.com",
                password: "1234",
            },
            { fullName: "Omer Sidi", email: "omer@sidi.com", password: "1234" },
            {
                _id: new mongoose_1.default.Types.ObjectId("424242424242424242424242"),
                fullName: "Anonymous",
                email: "anonymous@example.com",
                password: "youWillNeverKnow42",
            },
        ];
        const users = await Promise.all(userData.map(async (user) => ({
            ...user,
            password: await bcrypt_1.default.hash(user.password, 10),
        })));
        const createdUsers = await user_model_1.User.insertMany(users);
        // Save user passwords before hashing
        const plainPasswords = userData.map((user) => ({
            email: user.email,
            password: user.password,
        }));
        // Function to generate new ObjectId
        function generateObjectId() {
            return new mongoose_2.Types.ObjectId();
        }
        const businesses = [
            {
                _id: generateObjectId(),
                name: "Starbucks",
                description: "Coffeehouse chain known for its signature roasts, light bites and WiFi availability.",
                category: "Food & Drink",
                imageUrl: "https://www.starbucks.com/static/images/global/logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "McDonald's",
                description: "American fast food company that operates and franchises a chain of restaurants.",
                category: "Food & Drink",
                imageUrl: "https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo-700x394.png",
            },
            {
                _id: generateObjectId(),
                name: "Burger King",
                description: "American multinational chain of hamburger fast food restaurants.",
                category: "Food & Drink",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/Burger_King_logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "KFC",
                description: "American fast food restaurant chain that specializes in fried chicken.",
                category: "Food & Drink",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/KFC_logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "Pizza Hut",
                description: "American multinational restaurant chain and international franchise known for its Italian-American cuisine including pizza and pasta.",
                category: "Food & Drink",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "Best Buy",
                description: "Chain retailer with a large array of brand-name electronics, computers, appliances & more.",
                category: "Electronics",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Best_Buy_logo_2018.svg",
            },
            {
                _id: generateObjectId(),
                name: "Apple Store",
                description: "Retail stores owned and operated by Apple Inc. that sells Apple products and provide tech support.",
                category: "Electronics",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
            },
            {
                _id: generateObjectId(),
                name: "Fry's Electronics",
                description: "Electronics retailer selling computers, software & consumer electronics, plus repair services.",
                category: "Electronics",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/49/Frys_Electronics_logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "Micro Center",
                description: "Retailer of computer products and consumer electronics.",
                category: "Electronics",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Micro_Center_Logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "RadioShack",
                description: "Chain of electronics retail stores offering a variety of electronics and accessories.",
                category: "Electronics",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/RadioShack_logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "Barnes & Noble",
                description: "Bookseller stocking housewares, plus a range of books, eBooks, DVDs & magazines.",
                category: "Books",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Barnes_and_Noble_201x_logo.svg",
            },
            {
                _id: generateObjectId(),
                name: "Books-A-Million",
                description: "Book retailer that sells a variety of books, magazines, collectibles, and toys.",
                category: "Books",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a1/Books-A-Million_logo.svg",
            },
        ];
        const createdBusinesses = await business_model_1.default.insertMany(businesses);
        // Create reviews
        const reviewContents = [
            "Excellent service!",
            "Very satisfied with the product.",
            "Highly recommend this place.",
            "Will definitely come back.",
            "Not up to the mark.",
        ];
        const reviews = [];
        createdBusinesses.forEach((business) => {
            const numReviews = Math.floor(Math.random() * 4) + 1;
            for (let i = 0; i < numReviews; i++) {
                const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                const content = reviewContents[Math.floor(Math.random() * reviewContents.length)];
                const stars = Math.floor(Math.random() * 5) + 1;
                const likes = createdUsers
                    .filter(() => Math.random() < 0.5)
                    .map((u) => u._id);
                const review = {
                    content,
                    business: business._id,
                    user: user._id,
                    userFullName: user.fullName,
                    stars,
                    likes,
                    createdAt: new Date(),
                };
                reviews.push(review);
            }
        });
        // Use create instead of insertMany to trigger validation for each document
        for (const review of reviews) {
            await review_model_1.default.create(review);
        }
        for (const business of createdBusinesses) {
            const reviewaBusiness = await review_model_1.default.find({ business: business._id });
            let count = 0;
            for (let review of reviewaBusiness) {
                count += review.stars;
            }
            const avg = (count / reviewaBusiness.length).toFixed(1);
            try {
                await business_model_1.default.findByIdAndUpdate(business._id, { stars: avg });
            }
            catch (err) {
                console.log(err.message);
            }
        }
        console.log("Database seeded!");
        console.log("User passwords:", plainPasswords);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await mongoose_1.default.connection.close();
    }
};
seedDatabase();
