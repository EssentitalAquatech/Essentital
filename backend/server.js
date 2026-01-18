// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";

// // ===== FIX __dirname =====
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ===== ENV =====
// dotenv.config();

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

// // ===== SERVE FRONTEND =====
// const frontendPath = path.join(__dirname, "../frontend/dist");

// app.use(express.static(frontendPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// // ===== START SERVER =====
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });




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









// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";

// // ===== FIX __dirname =====
// const __filename = fileURLToPath(import.meta.url);
// const _dirname = path.dirname(_filename);

// // ===== ENV =====
// dotenv.config();

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

// // ===== SERVE FRONTEND =====
// const frontendPath = path.join(__dirname, "../frontend/dist");

// app.use(express.static(frontendPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// // ===== START SERVER =====
// app.listen(PORT, () => {
//   console.log(🚀 Server running on port ${PORT});
// });






import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ===== ENV (TOP PE) =====
dotenv.config();

// ===== FIX __dirname =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // ✅ Fixed: changed _dirname to __dirname

// ===== IMPORT ROUTES =====
import dbConnect from "./database/dbConnection.js";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC UPLOADS =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== DATABASE =====
dbConnect();

// ===== API ROUTES =====
app.use("/api/user", userRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminLoginRoutes);

// ===== FRONTEND =====
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===== START SERVER =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`); // ✅ Fixed: added backticks for template literal
});