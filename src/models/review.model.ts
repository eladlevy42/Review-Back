import { Schema, model, Document } from "mongoose";

interface IReview extends Document {
  content: string;
  business: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  stars: string;
  likes: Schema.Types.ObjectId[];
  userFullName: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  content: { type: String, required: true },
  business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stars: { type: String, required: true, ref: "Stars", default: "3" },
  likes: { type: [Schema.Types.ObjectId], default: [] },
  userFullName: { type: String },
  createdAt: { type: Date, required: true },
});

const Review = model<IReview>("Review", reviewSchema);
export default Review;
