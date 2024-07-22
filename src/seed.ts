import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Business from "./models/business.model";
import Review from "./models/review.model";
import { User } from "./models/user.model";
import dotenv from "dotenv";
import { Types } from "mongoose";
import { login } from "./controllers/auth.controller";
// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGO_URI || ""; // Fallback to a default URI if not set

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected!");

    // Clear existing data
    await Business.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

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
        fullName: "Michael Brown",
        email: "michael@example.com",
        password: "password123",
      },
      {
        fullName: "Emma Wilson",
        email: "emma@example.com",
        password: "password123",
      },
      {
        fullName: "Oliver Taylor",
        email: "oliver@example.com",
        password: "password123",
      },
      {
        _id: new mongoose.Types.ObjectId("424242424242424242424242"),
        fullName: "Anonymous",
        email: "anonymous@example.com",
        password: "youWillNeverKnow42",
      },
    ];

    const users = await Promise.all(
      userData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(users);

    // Save user passwords before hashing
    const plainPasswords = userData.map((user) => ({
      email: user.email,
      password: user.password,
    }));
    function generateObjectId(): Types.ObjectId {
      return new Types.ObjectId();
    }
    // Create businesses
    const businesses = [
      {
        _id: generateObjectId(),
        name: "Starbucks",
        description:
          "Coffeehouse chain known for its signature roasts, light bites and WiFi availability.",
        category: "Food & Drink",
      },
      {
        _id: generateObjectId(),
        name: "Best Buy",
        description:
          "Chain retailer with a large array of brand-name electronics, computers, appliances & more.",
        category: "Electronics",
      },
      {
        _id: generateObjectId(),
        name: "Barnes & Noble",
        description:
          "Bookseller stocking housewares, plus a range of books, eBooks, DVDs & magazines.",
        category: "Books",
      },
      {
        _id: generateObjectId(),
        name: "Planet Fitness",
        description:
          "Gym offering cardio & strength equipment, plus fitness training & exercise classes.",
        category: "Health & Fitness",
      },
      {
        _id: generateObjectId(),
        name: "H&M",
        description:
          "Retailer known for its trendy, affordable apparel & accessories for men, women & kids.",
        category: "Fashion",
      },
      {
        _id: generateObjectId(),
        name: "Jiffy Lube",
        description:
          "Oil change service offering preventive auto maintenance & vehicle inspections.",
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
        description:
          "Home improvement retailer with a wide range of products, including appliances & tools.",
        category: "Home Improvement",
      },
      {
        _id: generateObjectId(),
        name: "REI",
        description:
          "Outdoor gear and apparel store offering rental equipment and adventure trips.",
        category: "Sports & Outdoors",
      },
      {
        _id: generateObjectId(),
        name: "Sephora",
        description:
          "Chain offering cosmetics, skincare, body, fragrance & haircare products.",
        category: "Beauty",
      },
      {
        _id: generateObjectId(),
        name: "IKEA",
        description:
          "Furniture store offering a wide variety of modern furniture, kitchen appliances & home accessories.",
        category: "Home",
      },
      {
        _id: generateObjectId(),
        name: "Expedia",
        description:
          "Travel agency offering flights, hotels, car rentals, vacation packages, and cruises.",
        category: "Travel",
      },
      {
        _id: generateObjectId(),
        name: "Trader Joe's",
        description:
          "Grocery chain with a variety of domestic & imported foods & beverages, plus housewares.",
        category: "Grocery",
      },
    ];

    const createdBusinesses = await Business.insertMany(businesses);

    console.log(
      "Created businesses:",
      createdBusinesses.map((b) => ({ _id: b._id, name: b.name }))
    );

    // Create reviews
    const reviewContents = [
      "Excellent service!",
      "Very satisfied with the product.",
      "Highly recommend this place.",
      "Will definitely come back.",
      "Not up to the mark.",
    ];

    const reviews: any[] = [];

    createdBusinesses.forEach((business) => {
      const numReviews = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numReviews; i++) {
        const user =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const content =
          reviewContents[Math.floor(Math.random() * reviewContents.length)];
        const stars = Math.floor(Math.random() * 5) + 1;
        const likes = createdUsers
          .filter(() => Math.random() < 0.5)
          .map((u: any) => u._id);
        const review = {
          content,
          business: business._id,
          user: user._id,
          userFullName: user.fullName,
          stars,
          likes,
          createdAt: new Date(),
        };
        console.log(review.business);
        console.log("Review object:", JSON.stringify(review, null, 2));
        reviews.push(review);
      }
    });

    // Use create instead of insertMany to trigger validation for each document
    try {
      for (const review of reviews) {
        const createdReview = await Review.create(review);
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }

    for (const business of createdBusinesses) {
      const reviewaBusiness = await Review.find({ business: business._id });
      let count = 0;
      for (let review of reviewaBusiness) {
        count += review.stars;
      }
      const avg = (count / reviewaBusiness.length).toFixed(1);
      try {
        await Business.findByIdAndUpdate(business._id, { stars: avg });
        console.log("new stars:" + avg);
      } catch (err: any) {
        console.log(err.message);
      }
    }

    console.log("Database seeded!");
    console.log("User passwords:", plainPasswords);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
