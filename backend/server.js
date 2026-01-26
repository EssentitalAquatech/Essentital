


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
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


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



// // //ye uper vala sahi hai 

















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
// app.use(cors({ origin: "*" })); // ya specific frontend URL
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ===== STATIC UPLOADS =====
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// }

// // ===== 404 HANDLING =====
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // ===== GLOBAL ERROR HANDLING =====
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

// // ===== START SERVER =====
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });













import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import userRoutes from "./routes/userRoutes.js";
import dealerRoutes from "./routes/dealerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ===== FIX __dirname (ES MODULE) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARES =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORRECT CORS CONFIG
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://essentital.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

// ✅ Preflight support (IMPORTANT)
app.options("*", cors());

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ===== API ROUTES =====
app.use("/api/user", userRoutes);
app.use("/api/dealers", dealerRoutes);

// ===== FRONTEND (BUILD) =====
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

//  SAFE FALLBACK (API SAFE)
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =====SERVER START =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
