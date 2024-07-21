import { Request, Response } from "express";
import { Document } from "mongoose";
import Business from "../models/business.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const SALT_ROUNDS = 10;

interface requestGetBusiness {
  query: {
    page: string;
  };
}

async function getBusiness(req: requestGetBusiness, res: Response) {
  let page = parseInt(req.query.page) || 0;
  if (page < 1) {
    page = 1;
  }
  try {
    const business = await Business.find()
      .skip((page - 1) * 10)
      .limit(10);
    res.status(201).json({ business });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ Error: err.message });
  }
}

module.exports = { getBusiness };
