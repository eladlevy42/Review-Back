import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Business from "./models/business.model";
import Review from "./models/review.model";
import { User } from "./models/user.model";
import dotenv from "dotenv";
import { Types } from "mongoose";

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

    // Function to generate new ObjectId
    function generateObjectId(): Types.ObjectId {
      return new Types.ObjectId();
    }

    const businesses = [
      {
        _id: generateObjectId(),
        name: "Starbucks",
        description:
          "Coffeehouse chain known for its signature roasts, light bites and WiFi availability.",
        category: "Food & Drink",
        imageUrl:
          "https://1000logos.net/wp-content/uploads/2023/04/Starbucks-logo.png",
      },
      {
        _id: generateObjectId(),
        name: "McDonald's",
        description:
          "American fast food company that operates and franchises a chain of restaurants.",
        category: "Food & Drink",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg",
      },
      {
        _id: generateObjectId(),
        name: "Burger King",
        description:
          "American multinational chain of hamburger fast food restaurants.",
        category: "Food & Drink",
        imageUrl:
          "https://logowik.com/content/uploads/images/burger-king-new-20218389.jpg",
      },
      {
        _id: generateObjectId(),
        name: "KFC",
        description:
          "American fast food restaurant chain that specializes in fried chicken.",
        category: "Food & Drink",
        imageUrl:
          "https://seeklogo.com/images/K/kfc-logo-A232F2E6D1-seeklogo.com.png",
      },
      {
        _id: generateObjectId(),
        name: "Pizza Hut",
        description:
          "American multinational restaurant chain and international franchise known for its Italian-American cuisine including pizza and pasta.",
        category: "Food & Drink",
        imageUrl:
          "https://www.logo-designer.co/storage/2014/11/Pizza-Hut-New-Logo-Design-6.jpg",
      },
      {
        _id: generateObjectId(),
        name: "Best Buy",
        description:
          "Chain retailer with a large array of brand-name electronics, computers, appliances & more.",
        category: "Electronics",
        imageUrl: "https://cdn.worldvectorlogo.com/logos/best-buy-1.svg",
      },
      {
        _id: generateObjectId(),
        name: "Apple Store",
        description:
          "Retail stores owned and operated by Apple Inc. that sells Apple products and provide tech support.",
        category: "Electronics",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/625px-Apple_logo_black.svg.png",
      },
      {
        _id: generateObjectId(),
        name: "Fry's Electronics",
        description:
          "Electronics retailer selling computers, software & consumer electronics, plus repair services.",
        category: "Electronics",
        imageUrl:
          "https://cdn.worldvectorlogo.com/logos/fry-s-electronics-1.svg",
      },
      {
        _id: generateObjectId(),
        name: "Micro Center",
        description: "Retailer of computer products and consumer electronics.",
        category: "Electronics",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJG_vtJ_l0mtzLB1M21_w21X-QKnk3S60BXw&s",
      },
      {
        _id: generateObjectId(),
        name: "RadioShack",
        description:
          "Chain of electronics retail stores offering a variety of electronics and accessories.",
        category: "Electronics",
        imageUrl:
          "https://seeklogo.com/images/R/RadioShack-logo-9615A35B0F-seeklogo.com.png",
      },
      {
        _id: generateObjectId(),
        name: "Barnes & Noble",
        description:
          "Bookseller stocking housewares, plus a range of books, eBooks, DVDs & magazines.",
        category: "Books",
        imageUrl:
          "https://banner2.cleanpng.com/20180821/tzo/kisspng-barnes-noble-logo-brand-product-design-book-barnes-and-noble-logo-png-transparent-www-galleryh-5b7ccbb8ebb8c6.7116184915349052729655.jpg",
      },
      {
        _id: generateObjectId(),
        name: "Books-A-Million",
        description:
          "Book retailer that sells a variety of books, magazines, collectibles, and toys.",
        category: "Books",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpGWQC-BbkFaT9tZdEoU6p2OChpbYhMkHJw&s",
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
        reviews.push(review);
      }
    });

    // Use create instead of insertMany to trigger validation for each document
    for (const review of reviews) {
      await Review.create(review);
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
