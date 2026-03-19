const express = require("express");
const router = express.Router();
const { placeOrder, trackOrder, updateCustomerDetails } = require("../controllers/order.controller");

// POST /api/orders       — place order
router.post("/", placeOrder);

// GET  /api/orders/track — track by orderId + email
router.get("/track", trackOrder);

// PATCH /api/orders/update-details — edit customer details (Placed only)
router.patch("/update-details", updateCustomerDetails);

module.exports = router;