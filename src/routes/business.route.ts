import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const router: Router = express.Router();
const { getBusiness } = require("../controllers/business.controller");
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

const typedGetBusiness = getBusiness as RequestHandler;
router.get("/", typedGetBusiness);

module.exports = router;
