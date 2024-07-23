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
        // Create businesses
        const businesses = [
            {
                _id: generateObjectId(),
                name: "Starbucks",
                description: "Coffeehouse chain known for its signature roasts, light bites and WiFi availability.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Best Buy",
                description: "Chain retailer with a large array of brand-name electronics, computers, appliances & more.",
                category: "Electronics",
            },
            {
                _id: generateObjectId(),
                name: "Barnes & Noble",
                description: "Bookseller stocking housewares, plus a range of books, eBooks, DVDs & magazines.",
                category: "Books",
            },
            {
                _id: generateObjectId(),
                name: "Planet Fitness",
                description: "Gym offering cardio & strength equipment, plus fitness training & exercise classes.",
                category: "Health & Fitness",
            },
            {
                _id: generateObjectId(),
                name: "H&M",
                description: "Retailer known for its trendy, affordable apparel & accessories for men, women & kids.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "Jiffy Lube",
                description: "Oil change service offering preventive auto maintenance & vehicle inspections.",
                category: "Automotive",
            },
            {
                _id: generateObjectId(),
                name: "Petco",
                description: "Pet supplies, pet food, and pet products.",
                category: "Pets",
            },
            {
                _id: generateObjectId(),
                name: "Lowe's",
                description: "Home improvement retailer with a wide range of products, including appliances & tools.",
                category: "Home Improvement",
            },
            {
                _id: generateObjectId(),
                name: "REI",
                description: "Outdoor gear and apparel store offering rental equipment and adventure trips.",
                category: "Sports & Outdoors",
            },
            {
                _id: generateObjectId(),
                name: "Sephora",
                description: "Chain offering cosmetics, skincare, body, fragrance & haircare products.",
                category: "Beauty",
            },
            {
                _id: generateObjectId(),
                name: "IKEA",
                description: "Furniture store offering a wide variety of modern furniture, kitchen appliances & home accessories.",
                category: "Home",
            },
            {
                _id: generateObjectId(),
                name: "Expedia",
                description: "Travel agency offering flights, hotels, car rentals, vacation packages, and cruises.",
                category: "Travel",
            },
            {
                _id: generateObjectId(),
                name: "Trader Joe's",
                description: "Grocery chain with a variety of domestic & imported foods & beverages, plus housewares.",
                category: "Grocery",
            },
            {
                _id: generateObjectId(),
                name: "Whole Foods Market",
                description: "Supermarket chain offering organic foods and products, with a focus on health and sustainability.",
                category: "Grocery",
            },
            {
                _id: generateObjectId(),
                name: "Walmart",
                description: "Multinational retail corporation that operates a chain of hypermarkets, discount department stores, and grocery stores.",
                category: "Retail",
            },
            {
                _id: generateObjectId(),
                name: "Amazon",
                description: "American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
                category: "Tech",
            },
            {
                _id: generateObjectId(),
                name: "Google",
                description: "American multinational technology company that specializes in Internet-related services and products.",
                category: "Tech",
            },
            {
                _id: generateObjectId(),
                name: "Facebook",
                description: "American online social media and social networking service owned by Meta Platforms.",
                category: "Tech",
            },
            {
                _id: generateObjectId(),
                name: "Nike",
                description: "American multinational corporation that designs, manufactures, and sells footwear, apparel, equipment, and accessories.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "Adidas",
                description: "German multinational corporation that designs and manufactures shoes, clothing, and accessories.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "Puma",
                description: "German multinational corporation that designs and manufactures athletic and casual footwear, apparel, and accessories.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "McDonald's",
                description: "American fast food company that operates and franchises a chain of restaurants.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Burger King",
                description: "American multinational chain of hamburger fast food restaurants.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "KFC",
                description: "American fast food restaurant chain that specializes in fried chicken.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Subway",
                description: "American multinational fast food restaurant franchise that primarily sells submarine sandwiches, wraps, salads, and drinks.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Pizza Hut",
                description: "American multinational restaurant chain and international franchise known for its Italian-American cuisine including pizza and pasta.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Domino's Pizza",
                description: "American multinational pizza restaurant chain.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Taco Bell",
                description: "American-based chain of fast food restaurants that serves a variety of Mexican-inspired foods.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Dunkin'",
                description: "American multinational coffee and doughnut company.",
                category: "Food & Drink",
            },
            {
                _id: generateObjectId(),
                name: "Costco",
                description: "American multinational corporation which operates a chain of membership-only warehouse clubs.",
                category: "Retail",
            },
            {
                _id: generateObjectId(),
                name: "Target",
                description: "American retail corporation, the 8th-largest retailer in the United States.",
                category: "Retail",
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
