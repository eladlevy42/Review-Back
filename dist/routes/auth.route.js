"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { getUser } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");
// Type assertions for the imported functions
const typedRegister = register;
const typedLogin = login;
const typedGetUser = getUser;
const typedVerifyToken = verifyToken;
router.get("/login", typedVerifyToken, typedGetUser);
router.post("/register", typedRegister);
router.post("/login", typedLogin);
module.exports = router;
