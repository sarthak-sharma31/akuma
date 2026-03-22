const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    reviewerName: { type: String, required: [true, "Reviewer name is required"], trim: true },
    reviewerEmail: { type: String, trim: true, lowercase: true, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    verified: { type: Boolean, default: true },
    approved: { type: Boolean, default: true }, // admin-added = auto approved, customer-submitted = needs approval
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;