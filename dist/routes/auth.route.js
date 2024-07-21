"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
// Type assertions for the imported functions
const typedRegister = register;
const typedLogin = login;
router.post("/register", typedRegister);
router.post("/login", typedLogin);
module.exports = router;
