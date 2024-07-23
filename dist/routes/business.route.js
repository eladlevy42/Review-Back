"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { getBusiness, createBusiness, upload, } = require("../controllers/business.controller");
const { verifyToken } = require("../middleware/auth.middleware");
// Type assertions for the imported functions
const typedGetBusiness = getBusiness;
const typedVerifyToken = verifyToken;
const typedCreateBusiness = createBusiness;
router.get("/", typedGetBusiness);
router.post("/", typedVerifyToken, upload.single("image"), typedCreateBusiness);
module.exports = router;
