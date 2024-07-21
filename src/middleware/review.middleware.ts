import { Request, Response, NextFunction } from "express";
import Business from "../models/business.model";

interface ExtendedRequest extends Request {
  params: { id: string };
  businessId: string;
}

async function verifyBusiness(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.query;
  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ Error: "business not found" });
    }
    if (typeof id === "string") {
      req.businessId = id;
      next();
    }
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { verifyBusiness };
