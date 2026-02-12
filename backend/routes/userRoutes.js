


// // routes/userRoutes.js
// import express from "express";
// import upload from "../middlewares/uploads.js"; // ✅ Memory storage for buffer uploads

// // ⭐ IMPORT AUTH MIDDLEWARE
// import authMiddleware from "../middlewares/authMiddleware.js"

// // ⭐ IMPORT SIGNUP CONTROLLER
// import { signup } from "../controllers/signupController.js";

// // ⭐ IMPORT USER CONTROLLERS
// import {
//   getUser,
//   updateProfile,
//   updatePassword,
//   updatePhoto,
//   getAllUsers,
// } from "../controllers/userController.js";

// import { login } from "../controllers/loginController.js";

// const router = express.Router();

// // ======================
// // ⭐ ALL ROUTES
// // ======================

// // ✅ SIGNUP (MULTIPLE FILES → BUFFER STORAGE)
// router.post(
//   "/signup",
//   upload.fields([
//     { name: "profile", maxCount: 1 },
//     { name: "aadharFront", maxCount: 1 },
//     { name: "aadharBack", maxCount: 1 },
//     { name: "pan", maxCount: 1 },
//     { name: "savingImg", maxCount: 1 },
//   ]),
//   signup
// );

// // ✅ LOGIN - No auth required
// router.post("/login", login);

// // ✅ GET ALL USERS - No auth required
// router.get("/", getAllUsers);

// // 🔒 PROTECTED ROUTES
// router.get("/:id", authMiddleware, getUser);
// router.put("/:id", authMiddleware, updateProfile);
// router.put("/password/:id", authMiddleware, updatePassword);

// // ✅ UPDATE PHOTO (BUFFER STORAGE)
// router.put(
//   "/photo/:id",
//   authMiddleware,
//   upload.single("photo"),
//   updatePhoto
// );

// export default router;



// //uper vala code sahi hai 


































// // routes/userRoutes.js
// import express from "express";
// import upload from "../middlewares/uploads.js"; // ✅ Memory storage for buffer uploads

// // ⭐ IMPORT AUTH MIDDLEWARE
// import authMiddleware from "../middlewares/authMiddleware.js"

// // ⭐ IMPORT SIGNUP CONTROLLER
// import { signup } from "../controllers/signupController.js";

// import { sendEmailOtp, verifyEmailOtp } from "../controllers/emailOtpController.js";

// // ⭐ IMPORT USER CONTROLLERS
// import {
//   getUser,
//   updateProfile,
//   updatePassword,
//   updatePhoto,
//   getAllUsers,
// } from "../controllers/userController.js";

// import { login } from "../controllers/loginController.js";

// const router = express.Router();

// // ======================
// // ⭐ ALL ROUTES
// // ======================

// // ✅ SIGNUP (MULTIPLE FILES → BUFFER STORAGE)
// router.post(
//   "/signup",
//   upload.fields([
//     { name: "profile", maxCount: 1 },
//     { name: "aadharFront", maxCount: 1 },
//     { name: "aadharBack", maxCount: 1 },
//     { name: "pan", maxCount: 1 },
//     { name: "savingImg", maxCount: 1 },
//   ]),
//   signup
// );

// // ✅ LOGIN - No auth required
// router.post("/login", login);

// // ✅ GET ALL USERS - No auth required
// router.get("/", getAllUsers);

// // 🔒 PROTECTED ROUTES
// router.get("/:id", authMiddleware, getUser);
// router.put("/:id", authMiddleware, updateProfile);
// router.put("/password/:id", authMiddleware, updatePassword);

// router.post("/send-otp", sendEmailOtp);
// router.post("/verify-otp", verifyEmailOtp);


// // ✅ UPDATE PHOTO (BUFFER STORAGE)
// router.put(
//   "/photo/:id",
//   authMiddleware,
//   upload.single("photo"),
//   updatePhoto
// );

// export default router;














// // routes/userRoutes.js
// import express from "express";
// import upload from "../middlewares/uploads.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

// import { signup } from "../controllers/signupController.js";
// import { login } from "../controllers/loginController.js";
// import { sendEmailOtp, verifyEmailOtp } from "../controllers/emailOtpController.js";

// import {
//   getUser,
//   updateProfile,
//   updatePassword,
//   updatePhoto,
//   getAllUsers,
// } from "../controllers/userController.js";

// const router = express.Router();

// // ======================
// // ✅ PUBLIC ROUTES (NO AUTH)
// // ======================

// // Signup
// router.post(
//   "/signup",
//   upload.fields([
//     { name: "profile", maxCount: 1 },
//     { name: "aadharFront", maxCount: 1 },
//     { name: "aadharBack", maxCount: 1 },
//     { name: "pan", maxCount: 1 },
//     { name: "savingImg", maxCount: 1 },
//   ]),
//   signup
// );

// // Normal Login (if still needed)
// router.post("/login", login);

// // OTP Routes (IMPORTANT: dynamic routes se upar)
// router.post("/send-otp", sendEmailOtp);
// router.post("/verify-otp", verifyEmailOtp);

// // Get all users
// router.get("/", getAllUsers);


// // ======================
// // 🔒 PROTECTED ROUTES
// // ======================

// // Update password (specific route first)
// router.put("/password/:id", authMiddleware, updatePassword);

// // Update photo
// router.put(
//   "/photo/:id",
//   authMiddleware,
//   upload.single("photo"),
//   updatePhoto
// );

// // Dynamic routes LAST
// router.get("/:id", authMiddleware, getUser);
// router.put("/:id", authMiddleware, updateProfile);

// export default router;




//ye uper vala bhi sahi hai iske baad jo niche vala hai login page par otp ke through vala hai 


























// routes/userRoutes.js
import express from "express";
import upload from "../middlewares/uploads.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import { signup } from "../controllers/signupController.js";
import { login } from "../controllers/loginController.js";
import { sendEmailOtp, verifyEmailOtp } from "../controllers/emailOtpController.js";

import {
  getUser,
  updateProfile,
  updatePassword,
  updatePhoto,
  getAllUsers,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

// ======================
// ✅ PUBLIC ROUTES (NO AUTH)
// ======================

// Signup
router.post(
  "/signup",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "savingImg", maxCount: 1 },
  ]),
  signup
);

// Normal Login (if still needed)
router.post("/login", login);

// OTP Routes (IMPORTANT: dynamic routes se upar)
router.post("/send-otp", sendEmailOtp);
router.post("/verify-otp", verifyEmailOtp);

// Forgot Password Routes
router.post("/forgot-password", sendForgotPasswordOtp);
// router.post("/verify-forgot-otp", verifyForgotPasswordOtp);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);

// Get all users
router.get("/", getAllUsers);


// ======================
// 🔒 PROTECTED ROUTES
// ======================

// Update password (specific route first)
router.put("/password/:id", authMiddleware, updatePassword);

// Update photo
router.put(
  "/photo/:id",
  authMiddleware,
  upload.single("photo"),
  updatePhoto
);

// Dynamic routes LAST
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateProfile);

export default router;
















