import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const router: Router = express.Router();
const {
  getBusiness,
  createBusiness,
} = require("../controllers/business.controller");
const { verifyToken } = require("../middleware/auth.middleware");
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
type Middleware = (req: Request, res: Response, next: NextFunction) => void;
const typedVerifyToken = verifyToken as Middleware;
const typedGetBusiness = getBusiness as RequestHandler;
const typedCreateBusiness = createBusiness as RequestHandler;
router.get("/", typedGetBusiness);
router.post("/", typedVerifyToken, typedCreateBusiness);
module.exports = router;
