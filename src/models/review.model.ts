import { Schema, model, Document, Types } from "mongoose";

interface IReview extends Document {
  content: string;
  business: Types.ObjectId;
  user: Types.ObjectId;
  userFullName: string;
  stars: number;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  content: { type: String, required: true },
  business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userFullName: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Review = model<IReview>("Review", reviewSchema);

export default Review;
