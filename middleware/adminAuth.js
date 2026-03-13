const { sendError } = require("../utils/sendResponse");

const adminAuth = (req, res, next) => {
  const password = req.headers["x-admin-password"];

  if (!password) {
    return sendError(res, 401, "Admin password is required");
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return sendError(res, 403, "Invalid admin password");
  }

  next();
};

module.exports = adminAuth;