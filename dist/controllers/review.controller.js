"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Mongoose, default: mongoose } = require("mongoose");
const review_model_1 = __importDefault(require("../models/review.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Function to get user full name by ID
async function getUserFullName(id) {
    try {
        const user = await user_model_1.default.findById(id);
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
    console.log(review);
    try {
        review.userFullName = await getUserFullName(review.user);
        const reviewToAdd = new review_model_1.default(review);
        const savedReview = await reviewToAdd.save();
        console.log(savedReview);
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
        console.log(savedReview);
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
async function getAvarageReviews(req, res) {
    const id = req.businessId;
    try {
        const reviews = await review_model_1.default.find({ business: id });
        console.log(reviews);
        if (reviews.length > 0) {
            let count = 0;
            reviews.forEach((review) => {
                count += parseInt(review.stars);
            });
            const avg = (count / reviews.length).toFixed(1);
            console.log(avg);
            return res.status(200).json({ average: `${avg}` });
        }
        else {
            return res.status(200).json({ avg: "0" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ err: err.message });
    }
}
module.exports = { getReviews, createReview, getAvarageReviews, anonymReview };
