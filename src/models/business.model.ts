import { Schema, model } from "mongoose";

interface IBusiness {
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
}

const businessSchema = new Schema<IBusiness>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Business = model<IBusiness>("Business", businessSchema);

export default Business;
