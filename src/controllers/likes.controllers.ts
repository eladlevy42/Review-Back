import { Response } from "express";
import Review from "../models/review.model";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware"; // Import AuthRequest
import { io } from "../index";

async function getLikeStatus(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const { userId } = req;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }
  const ObjUserId = new mongoose.Types.ObjectId(userId);
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    const index = review.likes.findIndex((id) => id.equals(ObjUserId));
    if (index !== -1) {
      return res.status(200).json({ liked: true });
    } else {
      return res.status(200).json({ liked: false });
    }
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function toggleLike(req: AuthRequest, res: Response): Promise<Response> {
  const { reviewId } = req.body;
  const { userId } = req;

  // Validate if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const ObjUserId = new mongoose.Types.ObjectId(userId);

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    const index = review.likes.findIndex((id) => id.equals(ObjUserId));
    if (index !== -1) {
      // If liked, remove the like
      review.likes = review.likes.filter((id) => !id.equals(ObjUserId));

      io.emit("dislike", { reviewId, likes: review.likes.length });
    } else {
      // If not liked, add the like
      review.likes.push(ObjUserId);

      io.emit("like", { reviewId, likes: review.likes.length });
    }

    const updatedReview = await review.save();

    return res.status(200).json({ liked: index == -1 });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { toggleLike, getLikeStatus };
