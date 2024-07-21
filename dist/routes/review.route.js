"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { verifyUser, verifyToken } = require("../middleware/auth.middleware");
const { getReviews, createReview, } = require("../controllers/review.controller");
const typedVerifyToken = verifyToken;
const router = express.Router();
// Type assertions for your imported functions
const typedGetReviews = getReviews;
const typedCreateReview = createReview;
// const typedToggleLike = toggleLike as RequestHandler;
const typedVerifyUser = verifyUser;
router.get("/", typedGetReviews);
router.post("/", typedVerifyToken, typedCreateReview);
// router.put("/", typedVerifyToken, typedVerifyUser, typedToggleLike);
module.exports = router;
