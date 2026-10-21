
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

// ── Configuration ──
const PORT = process.env.PORT || 5000;
const PING_URL = process.env.PING_URL;
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

// ── Connect to MongoDB ──
connectDB();

// ── Global Middleware ──
app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

// ── Root Route ──
app.get("/", (req, res) => {
  res.json({
    status: "AkumaFits API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Health Check Route ──
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "AkumaFits API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// ── Ping URL Function ──
const pingUrl = async () => {
  if (!PING_URL) {
    console.error("❌ PING_URL is missing in your .env file");
    return;
  }

  try {
    const response = await fetch(PING_URL, {
      signal: AbortSignal.timeout(15000),
    });

    console.log(
      `✅ Ping response: ${response.status} | ${PING_URL} | ${new Date().toISOString()}`
    );

    await response.body?.cancel();
  } catch (error) {
    console.error(
      `❌ Ping failed: ${PING_URL} | ${error.message} | ${new Date().toISOString()}`
    );
  }
};

// ── Error Handling (must be last) ──
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 AkumaFits API running on port ${PORT}`);

  // Ping immediately, then every 10 minutes
  pingUrl();
  setInterval(pingUrl, PING_INTERVAL);
});
