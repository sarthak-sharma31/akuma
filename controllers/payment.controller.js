const crypto = require("crypto");
const Order = require("../models/Order");
const { sendSuccess, sendError } = require("../utils/sendResponse");

// Lazy-load Razorpay so server doesn't crash if keys aren't set yet
const getRazorpay = () => {
  const Razorpay = require("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/**
 * @desc  Create a Razorpay order (called before showing payment popup)
 * @route POST /api/payment/create-order
 */
const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) return sendError(res, 400, "Amount is required");

    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(amount * 100), // Razorpay needs paise (₹1 = 100 paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    sendSuccess(res, 200, {
      orderId: order.id,         // rzp_order_id — needed by frontend
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Verify payment signature + save order to DB
 * @route POST /api/payment/verify
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      total,
    } = req.body;

    // 1. Verify the signature (proves payment is genuine, not tampered)
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return sendError(res, 400, "Payment verification failed. Invalid signature.");
    }

    // 2. Save the confirmed order to MongoDB
    const order = await Order.create({
      customer,
      items,
      total,
      status: "Confirmed", // already paid — skip "Placed"
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    });

    sendSuccess(res, 201, {
      orderId: order.orderId,
      message: "Payment verified and order placed!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaymentOrder, verifyPayment };