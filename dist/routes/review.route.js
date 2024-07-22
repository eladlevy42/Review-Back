"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
const { getReviews, createReview, getAvarageReviews, anonymReview, } = require("../controllers/review.controller");
const { verifyBusiness } = require("../middleware/review.middleware");
const typedVerifyToken = verifyToken;
const router = express.Router();
// Type assertions for your imported functions
const typedAnonymReview = anonymReview;
const typedGetReviews = getReviews;
const typedCreateReview = createReview;
const typedAvgReviews = getAvarageReviews;
const typedVerifyBusiness = verifyBusiness;
router.post("/anony/:id", typedVerifyBusiness, typedAnonymReview);
router.get("/avg/:id", typedVerifyBusiness, typedAvgReviews);
router.get("/:id", typedVerifyBusiness, typedGetReviews);
router.post("/:id", typedVerifyToken, typedVerifyBusiness, typedCreateReview);
module.exports = router;
