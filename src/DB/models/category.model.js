import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true },
  image: { secure_url: String, public_id: String },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
categorySchema.virtual("providerNumber", {
  ref: "User",
  localField: "_id",
  foreignField: "profession",
});
categorySchema.virtual("servicesNumber", {
  ref: "Service",
  localField: "_id",
  foreignField: "categoryId",
});

export const CategoryModel = mongoose.model.Category || mongoose.model("Category", categorySchema);
