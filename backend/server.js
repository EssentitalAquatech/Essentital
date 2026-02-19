


// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";


// // ===== ENV (TOP PE) =====
// dotenv.config();

// // ===== FIX __dirname =====
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// // ===== IMPORT ROUTES =====
// import dbConnect from "./database/dbConnection.js";
// import accessRoutes from "./routes/accessRoutes.js";
// import adminLoginRoutes from "./routes/adminLoginRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import dealerRoutes from "./routes/dealerRoutes.js";
// import farmerRoutes from "./routes/farmerRoutes.js";
// import historyRoutes from "./routes/historyRoutes.js";
// import imageRoutes from "./routes/imageRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import userRoutes from "./routes/userRoutes.js";

// // ===== APP INIT =====
// const app = express();
// const PORT = process.env.PORT || 2008;

// // ===== MIDDLEWARE =====
// app.use(cors({ origin: "*" }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ===== STATIC UPLOADS =====
//  //app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // ===== DATABASE =====
// dbConnect();

// // ===== API ROUTES =====
// app.use("/api/user", userRoutes);
// app.use("/api/farmers", farmerRoutes);
// app.use("/api/dealers", dealerRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/images", imageRoutes);
// app.use("/api/access", accessRoutes);
// app.use("/api/notification", notificationRoutes);
// app.use("/api/history", historyRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin", adminLoginRoutes);

// // ===== FRONTEND =====
// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "../frontend/dist");
//   app.use(express.static(frontendPath));
//   app.use((req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// }





// // ===== START SERVER =====
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });










//uper vala sahi hai 







import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// ===== ENV =====
dotenv.config();

// ===== FIX __dirname =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== IMPORT ROUTES =====
import accessRoutes from "./routes/accessRoutes.js";
import adminLoginRoutes from "./routes/adminLoginRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dealerRoutes from "./routes/dealerRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ===== APP INIT =====
const app = express();
const PORT = process.env.PORT || 2008;

// ===== MIDDLEWARE =====
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ===== TEST ROUTE =====
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    env: process.env.NODE_ENV,
    mongodb: process.env.MONGODB_URI || process.env.MONGO_URI ? "Set" : "Not Set"
  });
});

// ===== DATABASE CONNECTION (FIXED) =====
console.log("📡 Connecting to MongoDB...");

const DB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!DB_URI) {
  console.error("❌ Database URI is not set in environment variables!");
} else {
  // ✅ FIX: Naye Mongoose version mein options ki zaroorat nahi
  mongoose.connect(DB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    
    // Initialize GridFS if available
    try {
      import("./config/gridfs.js").then(({ initGridFS }) => {
        initGridFS();
        console.log("✅ GridFS initialized");
      }).catch(err => {
        console.log("⚠️ GridFS not available:", err.message);
      });
    } catch (err) {
      console.log("⚠️ GridFS import failed:", err.message);
    }
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });
}

// ===== API ROUTES =====
console.log("📝 Registering routes...");

app.use("/api/farmers", farmerRoutes);
console.log("✅ /api/farmers registered");

app.use("/api/user", userRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminLoginRoutes);

// ===== 404 HANDLER =====
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "Route not found",
    path: req.url,
    method: req.method
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);
  res.status(500).json({ 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ===== START SERVER =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Test URL: http://localhost:${PORT}/api/health`);
});