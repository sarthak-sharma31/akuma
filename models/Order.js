const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    customer: {
      name: { type: String, required: [true, "Name is required"], trim: true },
      email: { type: String, required: [true, "Email is required"], trim: true, lowercase: true },
      phone: { type: String, required: [true, "Phone is required"], trim: true },
      address: { type: String, required: [true, "Address is required"], trim: true },
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
    notes: { type: String, default: "" }, // admin notes
    paymentId: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-generate a short order ID before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.orderId = `AK-${timestamp}-${random}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;