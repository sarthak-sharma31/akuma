const express = require("express");
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require("../controllers/payment.controller");

// POST /api/payment/create-order  — create Razorpay order before showing popup
router.post("/create-order", createPaymentOrder);

// POST /api/payment/verify        — verify signature + save order to DB
router.post("/verify", verifyPayment);

module.exports = router;