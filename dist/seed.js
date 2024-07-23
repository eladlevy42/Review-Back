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
            // Food & Drink
            {
                _id: generateObjectId(),
                name: "Starbucks",
                description: "Coffeehouse chain known for its signature roasts, light bites and WiFi availability.",
                category: "Food & Drink",
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
                name: "Pizza Hut",
                description: "American multinational restaurant chain and international franchise known for its Italian-American cuisine including pizza and pasta.",
                category: "Food & Drink",
            },
            // Electronics
            {
                _id: generateObjectId(),
                name: "Best Buy",
                description: "Chain retailer with a large array of brand-name electronics, computers, appliances & more.",
                category: "Electronics",
            },
            {
                _id: generateObjectId(),
                name: "Apple Store",
                description: "Retail stores owned and operated by Apple Inc. that sells Apple products and provide tech support.",
                category: "Electronics",
            },
            {
                _id: generateObjectId(),
                name: "Fry's Electronics",
                description: "Electronics retailer selling computers, software & consumer electronics, plus repair services.",
                category: "Electronics",
            },
            {
                _id: generateObjectId(),
                name: "Micro Center",
                description: "Retailer of computer products and consumer electronics.",
                category: "Electronics",
            },
            {
                _id: generateObjectId(),
                name: "RadioShack",
                description: "Chain of electronics retail stores offering a variety of electronics and accessories.",
                category: "Electronics",
            },
            // Books
            {
                _id: generateObjectId(),
                name: "Barnes & Noble",
                description: "Bookseller stocking housewares, plus a range of books, eBooks, DVDs & magazines.",
                category: "Books",
            },
            {
                _id: generateObjectId(),
                name: "Books-A-Million",
                description: "Book retailer that sells a variety of books, magazines, collectibles, and toys.",
                category: "Books",
            },
            {
                _id: generateObjectId(),
                name: "The Strand",
                description: "Iconic New York City bookstore known for its extensive collection of new, used, and rare books.",
                category: "Books",
            },
            {
                _id: generateObjectId(),
                name: "Powell's Books",
                description: "Independent bookstore based in Portland, Oregon, selling new and used books.",
                category: "Books",
            },
            {
                _id: generateObjectId(),
                name: "Waterstones",
                description: "British book retailer that sells a variety of books, eBooks, and stationery.",
                category: "Books",
            },
            // Health & Fitness
            {
                _id: generateObjectId(),
                name: "Planet Fitness",
                description: "Gym offering cardio & strength equipment, plus fitness training & exercise classes.",
                category: "Health & Fitness",
            },
            {
                _id: generateObjectId(),
                name: "24 Hour Fitness",
                description: "Fitness center chain offering personal training, group exercise classes, and a variety of fitness equipment.",
                category: "Health & Fitness",
            },
            {
                _id: generateObjectId(),
                name: "LA Fitness",
                description: "Gym chain offering a variety of fitness classes, personal training, and state-of-the-art equipment.",
                category: "Health & Fitness",
            },
            {
                _id: generateObjectId(),
                name: "Gold's Gym",
                description: "Fitness center chain known for its strength training facilities and personal training services.",
                category: "Health & Fitness",
            },
            {
                _id: generateObjectId(),
                name: "Equinox",
                description: "Luxury fitness club offering high-end fitness equipment, personal training, and wellness services.",
                category: "Health & Fitness",
            },
            // Fashion
            {
                _id: generateObjectId(),
                name: "H&M",
                description: "Retailer known for its trendy, affordable apparel & accessories for men, women & kids.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "Zara",
                description: "International fashion retailer known for its trendy clothing, accessories, and footwear.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "Uniqlo",
                description: "Japanese fashion retailer known for its high-quality, affordable basics.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "Gap",
                description: "American clothing retailer offering casual wear for men, women, and children.",
                category: "Fashion",
            },
            {
                _id: generateObjectId(),
                name: "Forever 21",
                description: "Retailer offering trendy, budget-friendly fashion for men, women, and teens.",
                category: "Fashion",
            },
            // Automotive
            {
                _id: generateObjectId(),
                name: "Jiffy Lube",
                description: "Oil change service offering preventive auto maintenance & vehicle inspections.",
                category: "Automotive",
            },
            {
                _id: generateObjectId(),
                name: "Pep Boys",
                description: "Automotive service chain offering tires, auto parts, and maintenance services.",
                category: "Automotive",
            },
            {
                _id: generateObjectId(),
                name: "AutoZone",
                description: "Retailer of aftermarket automotive parts and accessories.",
                category: "Automotive",
            },
            {
                _id: generateObjectId(),
                name: "O'Reilly Auto Parts",
                description: "Retailer of automotive parts, tools, supplies, equipment, and accessories.",
                category: "Automotive",
            },
            {
                _id: generateObjectId(),
                name: "Firestone Complete Auto Care",
                description: "Automotive repair and maintenance service chain offering tires, brakes, and more.",
                category: "Automotive",
            },
            // Pets
            {
                _id: generateObjectId(),
                name: "Petco",
                description: "Pet supplies, pet food, and pet products.",
                category: "Pets",
            },
            {
                _id: generateObjectId(),
                name: "PetSmart",
                description: "Retailer of pet supplies, pet food, and pet services such as grooming and training.",
                category: "Pets",
            },
            {
                _id: generateObjectId(),
                name: "Chewy",
                description: "Online retailer of pet food and other pet-related products.",
                category: "Pets",
            },
            {
                _id: generateObjectId(),
                name: "Pet Supplies Plus",
                description: "Pet supply retailer offering pet food, supplies, and accessories.",
                category: "Pets",
            },
            {
                _id: generateObjectId(),
                name: "Petland",
                description: "Retailer offering pet supplies, pet food, and small pets.",
                category: "Pets",
            },
            // Home Improvement
            {
                _id: generateObjectId(),
                name: "Lowe's",
                description: "Home improvement retailer with a wide range of products, including appliances & tools.",
                category: "Home Improvement",
            },
            {
                _id: generateObjectId(),
                name: "Home Depot",
                description: "Retailer offering home improvement and construction products and services.",
                category: "Home Improvement",
            },
            {
                _id: generateObjectId(),
                name: "Menards",
                description: "Home improvement chain offering building materials, tools, and home appliances.",
                category: "Home Improvement",
            },
            {
                _id: generateObjectId(),
                name: "Ace Hardware",
                description: "Retailer of home improvement products and services, including hardware, tools, and paint.",
                category: "Home Improvement",
            },
            {
                _id: generateObjectId(),
                name: "True Value",
                description: "Hardware store cooperative offering home improvement products and services.",
                category: "Home Improvement",
            },
            // Sports & Outdoors
            {
                _id: generateObjectId(),
                name: "REI",
                description: "Outdoor gear and apparel store offering rental equipment and adventure trips.",
                category: "Sports & Outdoors",
            },
            {
                _id: generateObjectId(),
                name: "Dick's Sporting Goods",
                description: "Sporting goods retailer offering a wide variety of sports equipment, apparel, and footwear.",
                category: "Sports & Outdoors",
            },
            {
                _id: generateObjectId(),
                name: "Bass Pro Shops",
                description: "Retailer specializing in hunting, fishing, camping, and other outdoor gear.",
                category: "Sports & Outdoors",
            },
            {
                _id: generateObjectId(),
                name: "Cabela's",
                description: "Retailer specializing in outdoor recreation merchandise, including hunting, fishing, and camping gear.",
                category: "Sports & Outdoors",
            },
            {
                _id: generateObjectId(),
                name: "Academy Sports + Outdoors",
                description: "Sporting goods discount store offering a wide variety of sports and outdoor equipment.",
                category: "Sports & Outdoors",
            },
            // Beauty
            {
                _id: generateObjectId(),
                name: "Sephora",
                description: "Chain offering cosmetics, skincare, body, fragrance & haircare products.",
                category: "Beauty",
            },
            {
                _id: generateObjectId(),
                name: "Ulta Beauty",
                description: "Beauty retailer offering cosmetics, skincare, haircare, and fragrance products.",
                category: "Beauty",
            },
            {
                _id: generateObjectId(),
                name: "Sally Beauty",
                description: "Retailer offering professional beauty supplies and hair care products.",
                category: "Beauty",
            },
            {
                _id: generateObjectId(),
                name: "M·A·C",
                description: "Cosmetics retailer offering a wide range of professional makeup products.",
                category: "Beauty",
            },
            {
                _id: generateObjectId(),
                name: "Lush",
                description: "Retailer offering handmade cosmetics and beauty products, known for its ethical sourcing.",
                category: "Beauty",
            },
            // Home
            {
                _id: generateObjectId(),
                name: "IKEA",
                description: "Furniture store offering a wide variety of modern furniture, kitchen appliances & home accessories.",
                category: "Home",
            },
            {
                _id: generateObjectId(),
                name: "Bed Bath & Beyond",
                description: "Retailer offering a wide range of home goods, including bedding, kitchenware, and home décor.",
                category: "Home",
            },
            {
                _id: generateObjectId(),
                name: "Pier 1 Imports",
                description: "Retailer offering a variety of home furnishings and décor items.",
                category: "Home",
            },
            {
                _id: generateObjectId(),
                name: "Crate & Barrel",
                description: "Retailer specializing in contemporary and modern furniture, housewares, and home accessories.",
                category: "Home",
            },
            {
                _id: generateObjectId(),
                name: "West Elm",
                description: "Retailer offering modern furniture and home décor products, known for its sustainable practices.",
                category: "Home",
            },
            // Travel
            {
                _id: generateObjectId(),
                name: "Expedia",
                description: "Travel agency offering flights, hotels, car rentals, vacation packages, and cruises.",
                category: "Travel",
            },
            {
                _id: generateObjectId(),
                name: "Booking.com",
                description: "Online travel agency offering hotel reservations, flights, car rentals, and vacation packages.",
                category: "Travel",
            },
            {
                _id: generateObjectId(),
                name: "TripAdvisor",
                description: "Travel website offering hotel, restaurant, and attraction reviews, and travel booking services.",
                category: "Travel",
            },
            {
                _id: generateObjectId(),
                name: "Airbnb",
                description: "Online marketplace for arranging or offering lodging, primarily homestays or tourism experiences.",
                category: "Travel",
            },
            {
                _id: generateObjectId(),
                name: "Kayak",
                description: "Travel search engine that helps you find the best deals on flights, hotels, and rental cars.",
                category: "Travel",
            },
            // Grocery
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
                name: "Kroger",
                description: "Supermarket chain offering a wide selection of groceries, fresh food, and household essentials.",
                category: "Grocery",
            },
            {
                _id: generateObjectId(),
                name: "Safeway",
                description: "Supermarket chain offering a wide variety of groceries and fresh produce.",
                category: "Grocery",
            },
            {
                _id: generateObjectId(),
                name: "Publix",
                description: "Employee-owned supermarket chain known for its customer service and fresh food offerings.",
                category: "Grocery",
            },
            // Retail
            {
                _id: generateObjectId(),
                name: "Walmart",
                description: "Multinational retail corporation that operates a chain of hypermarkets, discount department stores, and grocery stores.",
                category: "Retail",
            },
            {
                _id: generateObjectId(),
                name: "Target",
                description: "American retail corporation, the 8th-largest retailer in the United States.",
                category: "Retail",
            },
            {
                _id: generateObjectId(),
                name: "Costco",
                description: "American multinational corporation which operates a chain of membership-only warehouse clubs.",
                category: "Retail",
            },
            {
                _id: generateObjectId(),
                name: "Macy's",
                description: "Department store chain offering a variety of products, including clothing, accessories, and home goods.",
                category: "Retail",
            },
            {
                _id: generateObjectId(),
                name: "Nordstrom",
                description: "Luxury department store chain offering clothing, footwear, accessories, and beauty products.",
                category: "Retail",
            },
            // Tech
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
                name: "Microsoft",
                description: "American multinational technology company that produces computer software, consumer electronics, personal computers, and related services.",
                category: "Tech",
            },
            {
                _id: generateObjectId(),
                name: "Apple",
                description: "American multinational technology company that designs, manufactures, and markets consumer electronics, software, and services.",
                category: "Tech",
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
