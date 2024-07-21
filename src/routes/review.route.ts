import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const { verifyUser, verifyToken } = require("../middleware/auth.middleware");
const {
  getReviews,
  createReview,
} = require("../controllers/review.controller");

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
// const typedToggleLike = toggleLike as RequestHandler;
const typedVerifyUser = verifyUser as RequestHandler;

router.get("/:id", typedGetReviews);
router.post("/:id", typedVerifyToken, typedCreateReview);
// router.put("/", typedVerifyToken, typedVerifyUser, typedToggleLike);

module.exports = router;
