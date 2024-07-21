import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const { verifyUser } = require("../middleware/auth.middleware");
const {
  getReviews,
  createReview,
  toggleLike,
} = require("../controllers/review.controller");

const router: Router = express.Router();

// Define types for your request handlers
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

// Type assertions for your imported functions
const typedGetReviews = getReviews as RequestHandler;
const typedCreateReview = createReview as RequestHandler;
const typedToggleLike = toggleLike as RequestHandler;
const typedVerifyUser = verifyUser as RequestHandler;

router.get("/", typedGetReviews);
router.post("/", typedVerifyUser, typedCreateReview);
router.put("/", typedVerifyUser, typedToggleLike);

module.exports = router;
