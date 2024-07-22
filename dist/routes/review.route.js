"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { verifyUser, verifyToken } = require("../middleware/auth.middleware");
const { getReviews, createReview, getAvarageReviews, } = require("../controllers/review.controller");
const { verifyBusiness } = require("../middleware/review.middleware");
const typedVerifyToken = verifyToken;
const router = express.Router();
// Type assertions for your imported functions
const typedGetReviews = getReviews;
const typedCreateReview = createReview;
const typedAvgReviews = getAvarageReviews;
// const typedToggleLike = toggleLike as RequestHandler;
const typedVerifyBusiness = verifyBusiness;
router.get("/avg/:id", typedVerifyBusiness, typedAvgReviews);
router.get("/:id", typedVerifyBusiness, typedGetReviews);
router.post("/:id", typedVerifyToken, typedVerifyBusiness, typedCreateReview);
// router.put("/", typedVerifyToken, typedVerifyUser, typedToggleLike);
module.exports = router;
