const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  verifyAdmin,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleVisible,
  toggleStock,
  toggleFeatured,
  seedProducts,
} = require("../controllers/admin.controller");

// Apply adminAuth to every route in this file
router.use(adminAuth);

// POST   /api/admin/verify
router.post("/verify", verifyAdmin);

// GET    /api/admin/products
router.get("/products", getAllProductsAdmin);

// POST   /api/admin/products
router.post("/products", createProduct);

// POST   /api/admin/products/seed
router.post("/products/seed", seedProducts);

// PUT    /api/admin/products/:id
router.put("/products/:id", updateProduct);

// DELETE /api/admin/products/:id
router.delete("/products/:id", deleteProduct);

// PATCH  /api/admin/products/:id/toggle-visible
router.patch("/products/:id/toggle-visible", toggleVisible);

// PATCH  /api/admin/products/:id/toggle-stock
router.patch("/products/:id/toggle-stock", toggleStock);

// PATCH  /api/admin/products/:id/toggle-featured
router.patch("/products/:id/toggle-featured", toggleFeatured);

module.exports = router;

// ── Order routes ──
const { getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/order.controller");

// GET    /api/admin/orders
router.get("/orders", getAllOrders);

// GET    /api/admin/orders/:orderId
router.get("/orders/:orderId", getOrderById);

// PATCH  /api/admin/orders/:orderId
router.patch("/orders/:orderId", updateOrderStatus);