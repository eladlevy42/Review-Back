import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Business from "./models/business.model";
import Review from "./models/review.model";
import User from "./models/user.model";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGO_URI || ""; // Fallback to a default URI if not set

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected!");

    // Drop the index on the username field if it exists
    try {
      await mongoose.connection.collection("users").dropIndex("username_1");
      console.log("Dropped index on username field.");
    } catch (error: any) {
      if (error.codeName === "IndexNotFound") {
        console.log("Index on username field not found.");
      } else {
        throw error;
      }
    }

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

    // Create businesses
    const businesses = [
      {
        name: "Starbucks",
        description:
          "Coffeehouse chain known for its signature roasts, light bites and WiFi availability.",
        category: "Food & Drink",
      },
      {
        name: "Best Buy",
        description:
          "Chain retailer with a large array of brand-name electronics, computers, appliances & more.",
        category: "Electronics",
      },
      {
        name: "Barnes & Noble",
        description:
          "Bookseller stocking housewares, plus a range of books, eBooks, DVDs & magazines.",
        category: "Books",
      },
      {
        name: "Planet Fitness",
        description:
          "Gym offering cardio & strength equipment, plus fitness training & exercise classes.",
        category: "Health & Fitness",
      },
      {
        name: "H&M",
        description:
          "Retailer known for its trendy, affordable apparel & accessories for men, women & kids.",
        category: "Fashion",
      },
      {
        name: "Jiffy Lube",
        description:
          "Oil change service offering preventive auto maintenance & vehicle inspections.",
        category: "Automotive",
      },
      {
        name: "Petco",
        description: "Pet supplies, pet food, and pet products.",
        category: "Pets",
      },
      {
        name: "Lowe's",
        description:
          "Home improvement retailer with a wide range of products, including appliances & tools.",
        category: "Home Improvement",
      },
      {
        name: "REI",
        description:
          "Outdoor gear and apparel store offering rental equipment and adventure trips.",
        category: "Sports & Outdoors",
      },
      {
        name: "Sephora",
        description:
          "Chain offering cosmetics, skincare, body, fragrance & haircare products.",
        category: "Beauty",
      },
      {
        name: "IKEA",
        description:
          "Furniture store offering a wide variety of modern furniture, kitchen appliances & home accessories.",
        category: "Home",
      },
      {
        name: "Expedia",
        description:
          "Travel agency offering flights, hotels, car rentals, vacation packages, and cruises.",
        category: "Travel",
      },
      {
        name: "Trader Joe's",
        description:
          "Grocery chain with a variety of domestic & imported foods & beverages, plus housewares.",
        category: "Grocery",
      },
    ];

    const createdBusinesses = await Business.insertMany(businesses);

    // Create reviews
    const reviewContents = [
      "Excellent service!",
      "Very satisfied with the product.",
      "Highly recommend this place.",
      "Will definitely come back.",
      "Not up to the mark.",
    ];

    const reviews: any = [];

    createdBusinesses.forEach((business) => {
      const numReviews = Math.floor(Math.random() * 4) + 1; // 1 to 4 reviews per business
      for (let i = 0; i < numReviews; i++) {
        const user =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const content =
          reviewContents[Math.floor(Math.random() * reviewContents.length)];
        const stars = Math.floor(Math.random() * 5) + 1; // Random stars between 1 and 5

        const likes = createdUsers
          .filter((u) => Math.random() < 0.5)
          .map((u) => u._id); // Randomly assign likes from other users

        reviews.push({
          content,
          business: business._id,
          user: user._id,
          stars,
          likes,
          createdAt: new Date(),
        });
      }
    });

    await Review.insertMany(reviews);

    console.log("Database seeded!");
    console.log("User passwords:", plainPasswords);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
