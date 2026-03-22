const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    reviewerName: { type: String, required: [true, "Reviewer name is required"], trim: true },
    reviewerEmail: { type: String, trim: true, lowercase: true, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
    images: { type: [String], default: [] }, // up to 3 images
    image: { type: String, default: "" },  // kept for backward compat
    images: { type: [String], default: [] }, // legacy single image support
    verified: { type: Boolean, default: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;