import { Request, Response } from "express";

import Business from "../models/business.model";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const SALT_ROUNDS = 10;

interface requestGetBusiness {
  query: {
    page: string;
  };
}
interface requestCreateBusiness {
  body: {
    name: string;
    description: string;
    category: string;
  };
  userId: string;
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
    res.status(200).json({ business });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ Error: err.message });
  }
}

async function createBusiness(req: requestCreateBusiness, res: Response) {
  const business = req.body;
  try {
    const newBusiness = new Business(business);
    await newBusiness.save();
    res.status(200).json({ message: "new Business Saved Succesfully" });
  } catch (err: any) {
    return res.status(400).json({ error: "Create new Business failed" });
  }
}

module.exports = { getBusiness, createBusiness };
