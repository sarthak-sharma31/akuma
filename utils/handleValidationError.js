const handleValidationError = (err, res) => {
  if (err.name !== "ValidationError") return false;

  const { sendError } = require("./sendResponse");
  const messages = Object.values(err.errors).map((e) => e.message);
  sendError(res, 400, messages.join(", "));
  return true;
};

module.exports = handleValidationError;