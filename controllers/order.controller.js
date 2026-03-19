const Order = require("../models/Order");
const { sendSuccess, sendError } = require("../utils/sendResponse");

// ─────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────

/**
 * @desc  Place a new order
 * @route POST /api/orders
 */
const placeOrder = async (req, res, next) => {
  try {
    const { customer, items, total } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, "Order must contain at least one item");
    }

    const order = await Order.create({ customer, items, total });

    sendSuccess(res, 201, {
      orderId: order.orderId,
      message: "Order placed successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Track an order by orderId + email (customer-facing)
 * @route GET /api/orders/track?orderId=AK-XXX&email=xx@xx.com
 */
const trackOrder = async (req, res, next) => {
  try {
    const { orderId, email } = req.query;

    if (!email) {
      return sendError(res, 400, "Email is required");
    }

    // If orderId provided — find exact order
    if (orderId) {
      const order = await Order.findOne({
        orderId: orderId.trim().toUpperCase(),
        "customer.email": email.trim().toLowerCase(),
      }).select("-__v");

      if (!order) {
        return sendError(res, 404, "Order not found. Check your Order ID and email.");
      }
      return sendSuccess(res, 200, { order });
    }

    // No orderId — return all orders for this email
    const orders = await Order.find({
      "customer.email": email.trim().toLowerCase(),
    }).select("-__v").sort({ createdAt: -1 });

    if (!orders.length) {
      return sendError(res, 404, "No orders found for this email address.");
    }

    sendSuccess(res, 200, { orders });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

/**
 * @desc  Get all orders (newest first)
 * @route GET /api/admin/orders
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, 200, { orders });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Get single order by orderId
 * @route GET /api/admin/orders/:orderId
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return sendError(res, 404, "Order not found");
    sendSuccess(res, 200, { order });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Update order status and/or notes
 * @route PATCH /api/admin/orders/:orderId
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!order) return sendError(res, 404, "Order not found");
    sendSuccess(res, 200, { order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  trackOrder,
  updateCustomerDetails,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};

/**
 * @desc  Update customer details (only allowed when status is "Placed")
 * @route PATCH /api/orders/update-details
 */
const updateCustomerDetails = async (req, res, next) => {
  try {
    const { orderId, email, name, phone, address } = req.body;

    if (!orderId || !email) {
      return sendError(res, 400, "Order ID and email are required");
    }

    const order = await Order.findOne({
      orderId: orderId.trim().toUpperCase(),
      "customer.email": email.trim().toLowerCase(),
    });

    if (!order) {
      return sendError(res, 404, "Order not found. Check your Order ID and email.");
    }

    if (order.status !== "Placed") {
      return sendError(res, 403, `Cannot edit details — order is already ${order.status}. Contact us at akumafits@gmail.com`);
    }

    // Only update fields that were provided
    if (name)    order.customer.name    = name.trim();
    if (phone)   order.customer.phone   = phone.trim();
    if (address) order.customer.address = address.trim();

    await order.save();

    sendSuccess(res, 200, { order, message: "Details updated successfully!" });
  } catch (err) {
    next(err);
  }
};