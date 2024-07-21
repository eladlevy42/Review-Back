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

    // Clear existing data
    await Business.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    // Create users
    const userData = [
      {
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
      },
      {
        username: "jane_doe",
        email: "jane@example.com",
        password: "password123",
      },
      {
        username: "sam_smith",
        email: "sam@example.com",
        password: "password123",
      },
      {
        username: "lisa_jones",
        email: "lisa@example.com",
        password: "password123",
      },
      {
        username: "michael_brown",
        email: "michael@example.com",
        password: "password123",
      },
      {
        username: "emma_wilson",
        email: "emma@example.com",
        password: "password123",
      },
      {
        username: "oliver_taylor",
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
      username: user.username,
      password: user.password,
    }));

    // Create businesses
    const businesses = [
      {
        name: "Tech Haven",
        description: "Best place for tech gadgets",
        category: "Electronics",
      },
      {
        name: "Gourmet Kitchen",
        description: "Delicious gourmet meals",
        category: "Food",
      },
      {
        name: "Book Worm",
        description: "A paradise for book lovers",
        category: "Books",
      },
      {
        name: "Fit Life",
        description: "Your fitness partner",
        category: "Health",
      },
      {
        name: "Style Street",
        description: "Latest fashion trends",
        category: "Fashion",
      },
      {
        name: "Auto Pro",
        description: "Reliable car services",
        category: "Automotive",
      },
      {
        name: "Pet Care",
        description: "Everything for your pet",
        category: "Pets",
      },
      {
        name: "Green Thumb",
        description: "Gardening supplies and advice",
        category: "Home",
      },
      {
        name: "Adventure Sports",
        description: "Gear for adventure sports",
        category: "Sports",
      },
      {
        name: "Beauty Bliss",
        description: "Your beauty essentials",
        category: "Beauty",
      },
      {
        name: "Home Comfort",
        description: "Quality home furnishings",
        category: "Home",
      },
      {
        name: "Travel Buddy",
        description: "Travel agency services",
        category: "Travel",
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
      const numReviews = Math.floor(Math.random() * 5) + 1; // 1 to 5 reviews per business
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
