import { Router, Request, Response, NextFunction } from "express";
const express = require("express");
const router: Router = express.Router();
const {
  getBusiness,
  createBusiness,
  upload,
} = require("../controllers/business.controller");

const { verifyToken } = require("../middleware/auth.middleware");

// Define a type for request handlers
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
type Middleware = (req: Request, res: Response, next: NextFunction) => void;
// Type assertions for the imported functions
const typedGetBusiness = getBusiness as RequestHandler;

const typedVerifyToken = verifyToken as Middleware;
const typedCreateBusiness = createBusiness as RequestHandler;
router.get("/", typedGetBusiness);
router.post("/", typedVerifyToken, upload.single("image"), typedCreateBusiness);
module.exports = router;
