const sendSuccess = (res, statusCode = 200, data = {}) => {
  res.status(statusCode).json({ success: true, ...data });
};

const sendError = (res, statusCode = 500, message = "Something went wrong") => {
  res.status(statusCode).json({ success: false, error: message });
};

module.exports = { sendSuccess, sendError };