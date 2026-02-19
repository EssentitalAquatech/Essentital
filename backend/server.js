


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
    import("./config/gridfs.js")
      .then(({ initGridFS }) => {
        initGridFS();
        console.log("✅ GridFS initialized");
      })
      .catch(err => console.log("⚠️ GridFS not available:", err.message));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err.message));
}

// ===== 🌟 CRITICAL: API ROUTES - MUST BE ABSOLUTELY FIRST =====
console.log("📝 Registering API routes...");

// Simple test route - this should ALWAYS work
app.get("/api/ping", (req, res) => {
  res.json({ success: true, message: "pong", time: new Date().toISOString() });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "API is working",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Backend API is running correctly!",
    routes: ["/api/farmers", "/api/user", "/api/dealers", "/api/health", "/api/ping"]
  });
});

// Farmers routes
app.use("/api/farmers", farmerRoutes);
console.log("✅ /api/farmers registered");

// Other API routes
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

// ===== API 404 HANDLER - Catch any unmatched API routes =====
app.use("/api", (req, res) => {
  console.log(`❌ API 404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "API route not found",
    path: req.url,
    method: req.method,
    availableRoutes: ["/api/farmers", "/api/user", "/api/dealers", "/api/health", "/api/ping", "/api/test"]
  });
});

// ===== FRONTEND STATIC FILES - ONLY AFTER ALL API ROUTES =====
if (process.env.NODE_ENV === "production") {
  console.log("📁 Setting up frontend static file serving...");
  
  // Look for frontend build
  const frontendPath = path.join(__dirname, "../frontend/dist");
  
  if (fs.existsSync(frontendPath)) {
    console.log(`✅ Frontend build found at: ${frontendPath}`);
    
    // Serve static files
    app.use(express.static(frontendPath));
    
    // For any non-API request, serve index.html
    app.get("*", (req, res) => {
      // Skip if it's an API route (should have been caught by API 404 handler)
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: "API route not found" });
      }
      
      const indexPath = path.join(frontendPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Frontend not found");
      }
    });
  } else {
    console.error(`❌ Frontend build NOT found at ${frontendPath}`);
    console.log("📁 Available directories:", fs.readdirSync(path.join(__dirname, "..")));
  }
} else {
  console.log("📁 Development mode - frontend not served");
  
  // In development, return a helpful message for root
  app.get("/", (req, res) => {
    res.json({ 
      message: "Backend server is running in development mode",
      api: "Use /api/ endpoints",
      test: "/api/test",
      health: "/api/health",
      ping: "/api/ping"
    });
  });
}

// ===== GLOBAL ERROR HANDLER =====
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
  console.log(`✅ Test your API:`);
  console.log(`   - https://essentital-r440.onrender.com/api/ping`);
  console.log(`   - https://essentital-r440.onrender.com/api/health`);
  console.log(`   - https://essentital-r440.onrender.com/api/test`);
  console.log(`   - https://essentital-r440.onrender.com/api/farmers/all?userId=6996fd1f8b6b8281a540b205`);
});