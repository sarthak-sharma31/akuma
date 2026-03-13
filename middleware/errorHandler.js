const { sendError } = require("../utils/sendResponse");

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${err.stack}`);

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return sendError(res, 400, "Invalid product ID format");
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `Duplicate value for field: ${field}`);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, messages.join(", "));
  }

  sendError(res, err.statusCode || 500, err.message || "Internal server error");
};

module.exports = errorHandler;