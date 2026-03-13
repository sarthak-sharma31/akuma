const Product = require("../models/Product");
const { sendSuccess, sendError } = require("../utils/sendResponse");

// @desc  Get all visible products
// @route GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    const filter = { visible: true };
    if (category && category !== "All") filter.category = category;
    if (featured === "true") filter.featured = true;

    const products = await Product.find(filter)
      .sort({ sortOrder: -1, createdAt: -1 })
      .select("-meeshoUrl -__v");

    sendSuccess(res, 200, { products });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single visible product by ID
// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select("-meeshoUrl -__v");

    if (!product || !product.visible) {
      return sendError(res, 404, "Product not found");
    }

    sendSuccess(res, 200, { product });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductById };