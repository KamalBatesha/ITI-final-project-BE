import mongoose from "mongoose";
import { days } from "../../utils/generalRules/index.js";


const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
  image: { secure_url: String, public_id: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  days: [{ type: String, required: true, enum:[...days] }],
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isConfirmed: { type: Boolean, default: false },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

export const ServiceModel = mongoose.model.Service || mongoose.model("Service", serviceSchema);
