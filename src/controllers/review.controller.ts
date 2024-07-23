const { Mongoose, default: mongoose } = require("mongoose");
import Review from "../models/review.model";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import Business from "../models/business.model";
import { io } from "../index";
import { ObjectId } from "mongoose";
interface ReviewsReq extends Request {
  body: {
    business: String;
    reviewId: String;
  };
  query: { stars: string; page: string };
  businessId: string;
}
interface AddReviewReq extends Request {
  businessId: string;
  userId: string;
  query: { id: string };
  body: Review;
}

interface Review extends Document {
  id?: string;
  user: string;
  userFullName: string | undefined;
  business: String;
  stars: string;
  content: String;
  likes: [String];
  createdAt: Date;
}
interface IReview {
  user: ObjectId | string;
  userFullName?: string;
  business: ObjectId | string;
  stars: number;
  content: string;
  likes: ObjectId[];
  createdAt: Date;
}

let reviewTotal: any[] = [];
// Function to get user full name by ID
async function getUserFullName(id: string): Promise<string | undefined> {
  try {
    const user = await User.findById(id);
    if (user) {
      console.log(user.fullName);
      return user.fullName;
    }
  } catch (err: any) {
    console.log(err.message);
  }
}

// Function to handle anonymous reviews
async function anonymReview(req: AddReviewReq, res: Response) {
  let review = req.body;
  review.business = req.businessId;
  review.user = "424242424242424242424242";
  review.createdAt = new Date();

  try {
    review.userFullName = await getUserFullName(review.user);
    const reviewToAdd = new Review(review);
    const savedReview = await reviewToAdd.save();
    console.log(reviewToAdd, typeof savedReview);
    getAvarageReviews(req.businessId);
    reviewTotal.push(savedReview);
    io.emit("getReviews", { reviewTotal, businessId: req.businessId });
    res.status(200).send({ message: "Review added successfully", review });
  } catch (err: any) {
    res
      .status(500)
      .send({ message: "Error adding review", error: err.message });
  }
}

async function getReviews(req: ReviewsReq, res: Response) {
  let page = parseInt(req.query.page) || 1;
  const { businessId } = req;
  const { stars } = req.query || "";
  if (page < 1) {
    page = 1;
  }
  const criteriaObj = {
    business: businessId,
  };
  try {
    const reviews: Review[] = await Review.find(criteriaObj);
    reviewTotal = reviews;
    io.emit("getReviews", { reviewTotal, businessId: req.businessId });
    res.json({ reviews });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function createReview(req: AddReviewReq, res: Response) {
  const review = req.body;
  review.createdAt = new Date();
  review.user = req.userId;
  review.business = req.businessId;
  try {
    review.userFullName = await getUserFullName(review.user);
    const reviewToAdd = new Review(review);
    const savedReview = await reviewToAdd.save();
    reviewTotal.push(savedReview);
    getAvarageReviews(req.businessId);
    io.emit("getReviews", { reviewTotal, businessId: req.businessId });
    res.status(201).json(savedReview);
  } catch (err: any) {
    console.log(
      `review.controller, createreview. Error while creating review: ${err.message}`
    );
    if (err.name === "ValidationError") {
      console.log(`review.conteoller, createreview. ${err.message}`);
      res.status(400).json({ message: err });
    } else {
      console.log(`review.conteoller, createreview. ${err.message}`);
      res.status(500).json({ message: "Server error while creating review" });
    }
  }
}

async function getAvarageReviews(id: string) {
  try {
    const reviews = await Review.find({ business: id });
    if (reviews.length > 0) {
      let count = 0;
      reviews.forEach((review) => {
        count += review.stars;
      });
      const avg: Number = parseFloat((count / reviews.length).toFixed(1));
      updateReviewAvg(id, avg);
      return;
    }
  } catch (err: any) {
    console.log(err);
    return;
  }
}

async function updateReviewAvg(businessId: string, newAvg: Number) {
  try {
    const business = await Business.findById(businessId);

    const newBusiness = await Business.findByIdAndUpdate(
      businessId,
      { stars: newAvg },
      { new: true, runValidators: true }
    );
    io.emit("newAvg", { businessId, newAvg });
    console.log(newAvg);
  } catch (err: any) {
    console.log(err);
  }
}
module.exports = { getReviews, createReview, getAvarageReviews, anonymReview };
