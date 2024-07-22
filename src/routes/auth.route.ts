import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const router: Router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { getUser } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const {
  verifyGoogle,
  signWithGoogle,
} = require("../controllers/google.controller");
// Define a type for request handlers
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
type Middleware = (req: Request, res: Response, next: NextFunction) => void;
// Type assertions for the imported functions
const typedRegister = register as RequestHandler;
const typedLogin = login as RequestHandler;
const typedGetUser = getUser as RequestHandler;
const typedVerifyToken = verifyToken as Middleware;
const typedSignGoogle = signWithGoogle as RequestHandler;
const typedVerifyGoogle = verifyGoogle as Middleware;
router.get("/login", typedVerifyToken, typedGetUser);
router.post("/register", typedRegister);
router.post("/login", typedLogin);
router.post("/google", typedVerifyGoogle, typedSignGoogle);
module.exports = router;
