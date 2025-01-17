"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Mongoose, default: mongoose } = require("mongoose");
const review_model_1 = __importDefault(require("../models/review.model"));
const user_model_1 = require("../models/user.model");
const business_model_1 = __importDefault(require("../models/business.model"));
const index_1 = require("../index");
let reviewTotal = [];
// Function to get user full name by ID
async function getUserFullName(id) {
    try {
        const user = await user_model_1.User.findById(id);
        if (user) {
            console.log(user.fullName);
            return user.fullName;
        }
    }
    catch (err) {
        console.log(err.message);
    }
}
// Function to handle anonymous reviews
async function anonymReview(req, res) {
    let review = req.body;
    review.business = req.businessId;
    review.user = "424242424242424242424242";
    review.createdAt = new Date();
    try {
        review.userFullName = await getUserFullName(review.user);
        const reviewToAdd = new review_model_1.default(review);
        const savedReview = await reviewToAdd.save();
        console.log(reviewToAdd, typeof savedReview);
        getAvarageReviews(req.businessId);
        reviewTotal.push(savedReview);
        index_1.io.emit("getReviews", { reviewTotal, businessId: req.businessId });
        res.status(200).send({ message: "Review added successfully", review });
    }
    catch (err) {
        res
            .status(500)
            .send({ message: "Error adding review", error: err.message });
    }
}
async function getReviews(req, res) {
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
        const reviews = await review_model_1.default.find(criteriaObj);
        reviewTotal = reviews;
        index_1.io.emit("getReviews", { reviewTotal, businessId: req.businessId });
        res.json({ reviews });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
async function createReview(req, res) {
    const review = req.body;
    review.createdAt = new Date();
    review.user = req.userId;
    review.business = req.businessId;
    try {
        review.userFullName = await getUserFullName(review.user);
        const reviewToAdd = new review_model_1.default(review);
        const savedReview = await reviewToAdd.save();
        reviewTotal.push(savedReview);
        getAvarageReviews(req.businessId);
        index_1.io.emit("getReviews", { reviewTotal, businessId: req.businessId });
        res.status(201).json(savedReview);
    }
    catch (err) {
        console.log(`review.controller, createreview. Error while creating review: ${err.message}`);
        if (err.name === "ValidationError") {
            console.log(`review.conteoller, createreview. ${err.message}`);
            res.status(400).json({ message: err });
        }
        else {
            console.log(`review.conteoller, createreview. ${err.message}`);
            res.status(500).json({ message: "Server error while creating review" });
        }
    }
}
async function getAvarageReviews(id) {
    try {
        const reviews = await review_model_1.default.find({ business: id });
        if (reviews.length > 0) {
            let count = 0;
            reviews.forEach((review) => {
                count += review.stars;
            });
            const avg = parseFloat((count / reviews.length).toFixed(1));
            updateReviewAvg(id, avg);
            return;
        }
    }
    catch (err) {
        console.log(err);
        return;
    }
}
async function updateReviewAvg(businessId, newAvg) {
    try {
        const business = await business_model_1.default.findById(businessId);
        const newBusiness = await business_model_1.default.findByIdAndUpdate(businessId, { stars: newAvg }, { new: true, runValidators: true });
        index_1.io.emit("newAvg", { businessId, newAvg });
        console.log(newAvg);
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = { getReviews, createReview, getAvarageReviews, anonymReview };
