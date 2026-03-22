const express = require("express");
const router = express.Router();
const { getReviews, submitReview } = require("../controllers/review.controller");

// GET  /api/reviews/:productId — public, approved only
router.get("/:productId", getReviews);

// POST /api/reviews — customer submit
router.post("/", submitReview);

module.exports = router;