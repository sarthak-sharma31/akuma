const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Original price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    tag: {
      type: String,
      enum: ["BESTSELLER", "NEW DROP", "HOT", "LIMITED", "SALE", ""],
      default: "",
    },
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
      default: ["S", "M", "L", "XL"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Tees", "Hoodies", "Joggers", "Accessories"],
      required: [true, "Category is required"],
    },
    meeshoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ visible: 1, category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ sortOrder: -1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;