require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const corsOptions = require("./config/corsOptions");
const productRoutes = require("./routes/product.routes");
const adminRoutes = require("./routes/admin.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Connect to MongoDB ──
connectDB();

// ── Global Middleware ──
app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

// ── Health Check ──
app.get("/", (req, res) => {
  res.json({
    status: "AkumaFits API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// ── Error Handling (must be last) ──
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AkumaFits API running on port ${PORT}`);
});