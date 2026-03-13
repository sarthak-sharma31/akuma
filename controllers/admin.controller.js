const Product = require("../models/Product");
const { sendSuccess, sendError } = require("../utils/sendResponse");
const handleValidationError = require("../utils/handleValidationError");

// @desc  Verify admin password
// @route POST /api/admin/verify
const verifyAdmin = (req, res) => {
  sendSuccess(res, 200, { message: "Password verified" });
};

// @desc  Get ALL products including hidden
// @route GET /api/admin/products
const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ sortOrder: -1, createdAt: -1 });
    sendSuccess(res, 200, { products });
  } catch (err) {
    next(err);
  }
};

// @desc  Create a new product
// @route POST /api/admin/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    sendSuccess(res, 201, { product });
  } catch (err) {
    if (handleValidationError(err, res)) return;
    next(err);
  }
};

// @desc  Update a product by ID
// @route PUT /api/admin/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) return sendError(res, 404, "Product not found");

    sendSuccess(res, 200, { product });
  } catch (err) {
    if (handleValidationError(err, res)) return;
    next(err);
  }
};

// @desc  Delete a product by ID
// @route DELETE /api/admin/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return sendError(res, 404, "Product not found");
    sendSuccess(res, 200, { message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc  Toggle product visibility
// @route PATCH /api/admin/products/:id/toggle-visible
const toggleVisible = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, "Product not found");
    product.visible = !product.visible;
    await product.save();
    sendSuccess(res, 200, { visible: product.visible });
  } catch (err) {
    next(err);
  }
};

// @desc  Toggle stock status
// @route PATCH /api/admin/products/:id/toggle-stock
const toggleStock = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, "Product not found");
    product.inStock = !product.inStock;
    await product.save();
    sendSuccess(res, 200, { inStock: product.inStock });
  } catch (err) {
    next(err);
  }
};

// @desc  Toggle featured status
// @route PATCH /api/admin/products/:id/toggle-featured
const toggleFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, "Product not found");
    product.featured = !product.featured;
    await product.save();
    sendSuccess(res, 200, { featured: product.featured });
  } catch (err) {
    next(err);
  }
};

// @desc  Seed multiple products at once
// @route POST /api/admin/products/seed
const seedProducts = async (req, res, next) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return sendError(res, 400, "Provide a non-empty products array");
    }
    const inserted = await Product.insertMany(products);
    sendSuccess(res, 201, { message: `${inserted.length} products seeded successfully` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyAdmin,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleVisible,
  toggleStock,
  toggleFeatured,
  seedProducts,
};