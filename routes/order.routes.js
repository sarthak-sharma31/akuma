const express = require("express");
const router = express.Router();
const { placeOrder, trackOrder } = require("../controllers/order.controller");

// POST /api/orders       — place order
router.post("/", placeOrder);

// GET  /api/orders/track — track by orderId + email
router.get("/track", trackOrder);

module.exports = router;