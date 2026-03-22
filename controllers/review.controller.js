const Review = require("../models/Review");
const { sendSuccess, sendError } = require("../utils/sendResponse");

// GET /api/reviews/:productId — public, only approved
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId, approved: true })
      .sort({ createdAt: -1 });
    sendSuccess(res, 200, { reviews });
  } catch (err) { next(err); }
};

// POST /api/reviews — customer submit (requires valid order)
const submitReview = async (req, res, next) => {
  try {
    const Order = require("../models/Order");
    const { productId, orderId, email, reviewerName, rating, comment, image } = req.body;

    if (!productId || !orderId || !email || !reviewerName || !rating) {
      return sendError(res, 400, "productId, orderId, email, reviewerName and rating are required");
    }

    // Verify customer actually ordered this product
    const order = await Order.findOne({
      orderId: orderId.trim().toUpperCase(),
      "customer.email": email.trim().toLowerCase(),
      status: { $in: ["Delivered", "Shipped", "Confirmed", "Placed"] },
    });

    if (!order) {
      return sendError(res, 403, "We could not verify your order. Please check your Order ID and email.");
    }

    // Check product is in the order
    const hasProduct = order.items.some(
      (item) => item.productId && item.productId.toString() === productId
    );
    if (!hasProduct) {
      return sendError(res, 403, "This product was not found in your order.");
    }

    // Check for duplicate
    const existing = await Review.findOne({ productId, reviewerEmail: email.trim().toLowerCase() });
    if (existing) {
      return sendError(res, 409, "You have already submitted a review for this product.");
    }

    const review = await Review.create({
      productId,
      reviewerName: reviewerName.trim(),
      reviewerEmail: email.trim().toLowerCase(),
      rating: Number(rating),
      comment: comment || "",
      image: image || "",
      verified: true,
      approved: false,
    });

    sendSuccess(res, 201, { message: "Review submitted! It will appear after we approve it." });
  } catch (err) { next(err); }
};

// ── ADMIN ──

const getAdminReviews = async (req, res, next) => {
  try {
    const filter = req.params.productId !== "pending"
      ? { productId: req.params.productId }
      : { approved: false };
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, 200, { reviews });
  } catch (err) { next(err); }
};

const createReview = async (req, res, next) => {
  try {
    const { productId, reviewerName, rating, comment, image, verified } = req.body;
    if (!productId || !reviewerName || !rating) {
      return sendError(res, 400, "productId, reviewerName and rating are required");
    }
    const review = await Review.create({ productId, reviewerName, rating, comment, image, verified, approved: true });
    sendSuccess(res, 201, { review });
  } catch (err) { next(err); }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) return sendError(res, 404, "Review not found");
    sendSuccess(res, 200, { review });
  } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return sendError(res, 404, "Review not found");
    sendSuccess(res, 200, { message: "Review deleted" });
  } catch (err) { next(err); }
};

const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!review) return sendError(res, 404, "Review not found");
    sendSuccess(res, 200, { review });
  } catch (err) { next(err); }
};

module.exports = { getReviews, submitReview, getAdminReviews, createReview, updateReview, deleteReview, approveReview };