const corsOptions = {
  origin: [
    "*",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "x-admin-password"],
};

module.exports = corsOptions;