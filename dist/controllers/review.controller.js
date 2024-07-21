"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Mongoose, default: mongoose } = require("mongoose");
const Review = require("../models/review.model");
async function getReviews(req, res) {
    let page = parseInt(req.query.page) || 1;
    const { business } = req.body || "";
    const { stars } = req.body || "";
    if (page < 1) {
        page = 1;
    }
    const criteriaObj = {
        business,
        stars,
    };
    try {
        const reviews = await Review.find({ criteriaObj });
        res.json({ reviews });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
async function createReview(req, res) {
    const review = req.body;
    review.user = req.userId;
    const reviewToAdd = new Review(review);
    try {
        const savedReview = await reviewToAdd.save();
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
async function toggleLike(req, res) {
    const review = req.body;
    let reviewLikesCopy = review.likes;
    function checkId(id) {
        return id != req.userId;
    }
    reviewLikesCopy.filter(checkId);
    review.likes = reviewLikesCopy;
    try {
        const updateReview = await Review.findByIdAndUpdate(review._id, review, {
            new: true,
            runValidators: true,
        });
        if (!updateReview) {
            console.log(`review.controller, updatereview. review not found with id: ${review._id}`);
            return res.status(404).json({ message: "review not found" });
        }
        res.json(updateReview);
    }
    catch (err) {
        console.log(`review.controller, updatereview. Error while updating review with id: ${review._id}`, err);
        if (err.name === "ValidationError") {
            // Mongoose validation error
            console.log(`review.controller, updatereview. ${err.message}`);
            res.status(400).json({ message: err.message });
        }
        else {
            // Other types of errors
            console.log(`review.controller, updatereview. ${err.message}`);
            res.status(500).json({ message: "Server error while updating review" });
        }
    }
}
module.exports = { getReviews, createReview, toggleLike };
