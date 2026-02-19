


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
import fs from "fs";

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

// ===== DATABASE CONNECTION =====
console.log("📡 Connecting to MongoDB...");

const DB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!DB_URI) {
  console.error("❌ Database URI is not set in environment variables!");
} else {
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

// ===== API ROUTES - THESE MUST COME FIRST =====
console.log("📝 Registering API routes...");

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

// ===== HEALTH CHECK ROUTE =====
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "API is working",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    mongodb: DB_URI ? "Connected" : "Not Connected"
  });
});

// ===== TEST ROUTE TO VERIFY API IS WORKING =====
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Backend API is running correctly!",
    routes: [
      "/api/farmers",
      "/api/user", 
      "/api/dealers",
      "/api/health"
    ]
  });
});

// ===== FRONTEND STATIC FILES - AFTER API ROUTES =====
if (process.env.NODE_ENV === "production") {
  console.log("📁 Setting up frontend static file serving...");
  
  // Try multiple possible frontend paths
  const possiblePaths = [
    path.join(__dirname, "../frontend/dist"),
    path.join(__dirname, "../../frontend/dist"),
    path.join(__dirname, "../public"),
    path.join(process.cwd(), "frontend/dist")
  ];
  
  let frontendPath = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      frontendPath = testPath;
      console.log(`✅ Frontend build found at: ${frontendPath}`);
      break;
    }
  }
  
  if (frontendPath) {
    // Serve static files
    app.use(express.static(frontendPath));
    
    // For any non-API request, serve index.html
    app.use((req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      
      const indexPath = path.join(frontendPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`❌ index.html not found at ${indexPath}`);
        res.status(404).send("Frontend not found. Please check build files.");
      }
    });
  } else {
    console.error("❌ Could not find frontend build in any location!");
    console.log("Searched in:", possiblePaths);
  }
} else {
  // Development mode - just log
  console.log("📁 Development mode - frontend not served");
}

// ===== 404 HANDLER FOR API ROUTES =====
app.use("/api", (req, res) => {
  console.log(`❌ 404 API: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "API route not found",
    path: req.url,
    method: req.method,
    availableRoutes: [
      "/api/farmers",
      "/api/user", 
      "/api/dealers",
      "/api/health",
      "/api/test"
    ]
  });
});

// ===== GLOBAL 404 HANDLER =====
app.use((req, res) => {
  // Don't log API routes twice
  if (!req.path.startsWith('/api/')) {
    console.log(`❌ 404: ${req.method} ${req.url}`);
  }
  
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
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`📡 Public URL: https://essentital-r440.onrender.com`);
  console.log(`✅ Test API: http://localhost:${PORT}/api/test`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
});