import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Business from "./models/business.model";
import Review from "./models/review.model";
import User from "./models/user.model";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGO_URI || ""; // Fallback to a default URI if not set
console.log(mongoURI);

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected!");

    // Clear existing data
    await Business.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    // Create users
    const users = [
      {
        username: "elad",
        email: "elad@example.com",
        password: await bcrypt.hash("elad", 10),
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: await bcrypt.hash("password2", 10),
      },
    ];

    const createdUsers = await User.insertMany(users);

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

    const createdBusinesses = await Business.insertMany(businesses);

    // Create reviews
    const reviews = [
      {
        content: "Great service!",
        business: createdBusinesses[0]._id,
        user: createdUsers[0]._id,
        likes: [],
      },
      {
        content: "Not bad.",
        business: createdBusinesses[1]._id,
        user: createdUsers[1]._id,
        likes: [],
      },
    ];

    await Review.insertMany(reviews);

    console.log("Database seeded!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
