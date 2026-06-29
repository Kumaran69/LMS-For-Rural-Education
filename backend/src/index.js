import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";
import parentRoutes from "./routes/parent.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes mapping
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/parent", parentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("VidyaQuest LMS Backend API is running...");
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vidyaquest";

console.log("Connecting to MongoDB...");
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
  })
  .then(() => {
    console.log("Database connected successfully to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.warn("⚠️ The server is starting but database features may fail if MongoDB is not running.");
  });

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (http://localhost:${PORT})`);
});
