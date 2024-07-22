import { Schema, model, Document, ObjectId } from "mongoose";
interface IBusiness extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  category: string;
  stars: number;
}
const businessSchema = new Schema<IBusiness>({
  _id: { type: Schema.ObjectId },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stars: { type: Number, default: 0 },
});
const Business = model<IBusiness>("Business", businessSchema);
export default Business;
