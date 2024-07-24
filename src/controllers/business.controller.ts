import { Request, Response } from "express";
import multer, { Multer } from "multer";
import { v2 as cloudinaryV2 } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import Business from "../models/business.model";

dotenv.config();

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload: Multer = multer({ dest: "uploads/" });

interface RequestCreateBusiness extends Request {
  body: {
    name: string;
    description: string;
    category: string;
    imageUrl?: string;
    stars?: string;
  };
  userId: string;
  file?: Express.Multer.File;
}

async function getBusiness(req: Request, res: Response) {
  let page = parseInt(req.query.page as string) || 1;
  const name = req.query.name as string;
  const category = req.query.category as string;
  const minRating = parseFloat(req.query.minRating as string) || 0;

  const query: any = {};
  if (name) {
    query.name = { $regex: name, $options: "i" }; // Case-insensitive regex search
  }
  if (category) {
    query.category = category;
  }
  if (minRating) {
    query.stars = { $gte: minRating };
  }

  try {
    const totalBusinesses = await Business.countDocuments(query);
    const business = await Business.find(query)
      .skip((page - 1) * 5)
      .limit(5);
    res.status(200).json({ business, totalBusinesses });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ Error: err.message });
  }
}

async function createBusiness(
  req: RequestCreateBusiness,
  res: Response
): Promise<void> {
  const businessData = req.body;
  businessData.stars = "0";
  try {
    if (req.file) {
      const result = await cloudinaryV2.uploader.upload(req.file.path);
      businessData.imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Remove the file from the local storage after uploading to Cloudinary
    }
    const newBusiness = new Business(businessData);
    await newBusiness.save();
    res
      .status(200)
      .json({ message: "New Business Saved Successfully", newBusiness });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ error: "Create new Business failed", message: err.message });
  }
}

export { getBusiness, createBusiness, upload };
