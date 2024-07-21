"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { verifyUser } = require("../middleware/auth.middleware");
const { getReviews, createReview, toggleLike, } = require("../controllers/review.controller");
const router = express.Router();
// Type assertions for your imported functions
const typedGetReviews = getReviews;
const typedCreateReview = createReview;
const typedToggleLike = toggleLike;
const typedVerifyUser = verifyUser;
router.get("/", typedGetReviews);
router.post("/", typedVerifyUser, typedCreateReview);
router.put("/", typedVerifyUser, typedToggleLike);
module.exports = router;
