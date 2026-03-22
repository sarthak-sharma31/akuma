const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  verifyAdmin, getAllProductsAdmin, createProduct, updateProduct,
  deleteProduct, toggleVisible, toggleStock, toggleFeatured, seedProducts,
} = require("../controllers/admin.controller");
const { getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/order.controller");

router.use(adminAuth);

// ── Products ──
router.post("/verify", verifyAdmin);
router.get("/products", getAllProductsAdmin);
router.post("/products", createProduct);
router.post("/products/seed", seedProducts);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:id/toggle-visible", toggleVisible);
router.patch("/products/:id/toggle-stock", toggleStock);
router.patch("/products/:id/toggle-featured", toggleFeatured);

// ── Orders ──
router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getOrderById);
router.patch("/orders/:orderId", updateOrderStatus);

module.exports = router;

// ── Review routes ──
const { getAdminReviews, createReview, updateReview, deleteReview, approveReview } = require("../controllers/review.controller");

router.get("/reviews/:productId", getAdminReviews);
router.post("/reviews", createReview);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);
router.patch("/reviews/:id/approve", approveReview);