import { Schema, model, Document, Types } from "mongoose";

interface IReview extends Document {
  content: string;
  business: Types.ObjectId;
  user: Types.ObjectId;
  likes: [Types.ObjectId];
}

const reviewSchema = new Schema<IReview>({
  content: { type: String, required: true },
  business: { type: Types.ObjectId, ref: "Business", required: true },
  user: { type: Types.ObjectId, ref: "User", required: true },
  likes: { type: [Types.ObjectId], default: [] },
});

const Review = model<IReview>("Review", reviewSchema);
export default Review;
