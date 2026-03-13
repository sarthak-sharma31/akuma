const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    // Add your Vercel URL after deploying:
    // "https://akumafits.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "x-admin-password"],
};

module.exports = corsOptions;