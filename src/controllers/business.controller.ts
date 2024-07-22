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

async function getBusiness(req: Request, res: Response) {
  let page = parseInt(req.query.page as string) || 1;
  const name = req.query.name as string;
  const category = req.query.category as string;

  const query: any = {};
  if (name) {
    query.name = { $regex: name, $options: "i" }; // Case-insensitive regex search
  }
  if (category) {
    query.category = category;
  }

  try {
    const business = await Business.find(query)
      .skip((page - 1) * 10)
      .limit(10);
    res.status(200).json({ business });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ Error: err.message });
  }
}

export default getBusiness;

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
