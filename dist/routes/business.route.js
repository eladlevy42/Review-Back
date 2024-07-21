"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { getBusiness } = require("../controllers/business.controller");
const typedGetBusiness = getBusiness;
router.get("/", typedGetBusiness);
module.exports = router;
