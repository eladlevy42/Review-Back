import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const { verifyUser, verifyToken } = require("../middleware/auth.middleware");
const {
  getReviews,
  createReview,
  getAvarageReviews,
} = require("../controllers/review.controller");
const { verifyBusiness } = require("../middleware/review.middleware");
type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const typedVerifyToken = verifyToken as Middleware;
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
const typedAvgReviews = getAvarageReviews as RequestHandler;
// const typedToggleLike = toggleLike as RequestHandler;
const typedVerifyBusiness = verifyBusiness as Middleware;
router.get("/avg/:id", typedVerifyBusiness, typedAvgReviews);
router.get("/:id", typedVerifyBusiness, typedGetReviews);
router.post("/:id", typedVerifyToken, typedVerifyBusiness, typedCreateReview);
// router.put("/", typedVerifyToken, typedVerifyUser, typedToggleLike);

module.exports = router;
