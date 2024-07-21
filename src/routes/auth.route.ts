import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const router: Router = express.Router();
const { register, login } = require("../controllers/auth.controller");

// Define a type for request handlers
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Type assertions for the imported functions
const typedRegister = register as RequestHandler;
const typedLogin = login as RequestHandler;

router.post("/register", typedRegister);
router.post("/login", typedLogin);

module.exports = router;
