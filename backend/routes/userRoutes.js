

// // import express from "express";
// // import multer from "multer";

// // // ⭐ IMPORT SIGNUP CONTROLLER
// // import { signup } from "../controllers/signupController.js";

// // // ⭐ IMPORT USER CONTROLLERS
// // import {
// //   getUser,
// //   updateProfile,
// //   updatePassword,
// //   updatePhoto,
// //   getAllUsers,
// // } from "../controllers/userController.js";

// // import { login } from "../controllers/loginController.js";

// // const router = express.Router();

// // // ======================
// // // ⭐ MULTER CONFIG
// // // ======================

// // // 🔹 1. Disk storage (SIGNUP images – unchanged)
// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "uploads/");
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, uniqueSuffix + "-" + file.originalname);
// //   },
// // });

// // const upload = multer({ storage });

// // // 🔹 2. Memory storage (PROFILE PHOTO UPDATE – NEW)
// // const uploadMemory = multer({
// //   storage: multer.memoryStorage(),
// // });

// // // ======================
// // // ⭐ ALL ROUTES
// // // ======================

// // // ✅ SIGNUP (With Files – DISK STORAGE)
// // router.post(
// //   "/signup",
// //   upload.fields([
// //     { name: "profile", maxCount: 1 },
// //     { name: "aadharFront", maxCount: 1 },
// //     { name: "aadharBack", maxCount: 1 },
// //     { name: "pan", maxCount: 1 },
// //     { name: "savingImg", maxCount: 1 },
// //   ]),
// //   signup
// // );

// // // LOGIN
// // router.post("/login", login);

// // // GET USER BY ID
// // router.get("/:id", getUser);

// // // UPDATE PROFILE (NAME)
// // router.put("/:id", updateProfile);

// // // UPDATE PASSWORD
// // router.put("/password/:id", updatePassword);

// // // ✅ UPDATE PHOTO (MEMORY STORAGE – FIXED)
// // router.put(
// //   "/photo/:id",
// //   uploadMemory.single("photo"),
// //   updatePhoto
// // );

// // // GET ALL USERS
// // router.get("/", getAllUsers);

// // export default router;












// //niche vala code login dubara na ho uske liye hai --

// import express from "express";
// import multer from "multer";

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
// // ⭐ MULTER CONFIG
// // ======================

// // 🔹 1. Disk storage (SIGNUP images – unchanged)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // 🔹 2. Memory storage (PROFILE PHOTO UPDATE – NEW)
// const uploadMemory = multer({
//   storage: multer.memoryStorage(),
// });

// // ======================
// // ⭐ ALL ROUTES
// // ======================

// // ✅ SIGNUP (With Files – DISK STORAGE) - No auth required
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

// // LOGIN - No auth required
// router.post("/login", login);

// // GET ALL USERS - No auth required (or add auth if needed)
// router.get("/", getAllUsers);

// // 🔒 PROTECTED ROUTES (All require authentication)

// // GET USER BY ID (PROTECTED)
// router.get("/:id", authMiddleware, getUser);

// // UPDATE PROFILE (NAME) (PROTECTED)
// router.put("/:id", authMiddleware, updateProfile);

// // UPDATE PASSWORD (PROTECTED)
// router.put("/password/:id", authMiddleware, updatePassword);

// // UPDATE PHOTO (PROTECTED)
// router.put(
//   "/photo/:id",
//   authMiddleware,
//   uploadMemory.single("photo"),
//   updatePhoto
// );

// export default router;













// import express from "express";
// import multer from "multer";

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
// // ⭐ MULTER CONFIG
// // ======================

// // 🔹 1. Disk storage (SIGNUP images – unchanged)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // 🔹 2. Memory storage (PROFILE PHOTO UPDATE – NEW)
// const uploadMemory = multer({
//   storage: multer.memoryStorage(),
// });

// // ======================
// // ⭐ ALL ROUTES
// // ======================

// // ✅ SIGNUP (With Files – DISK STORAGE)
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

// // LOGIN
// router.post("/login", login);

// // GET USER BY ID
// router.get("/:id", getUser);

// // UPDATE PROFILE (NAME)
// router.put("/:id", updateProfile);

// // UPDATE PASSWORD
// router.put("/password/:id", updatePassword);

// // ✅ UPDATE PHOTO (MEMORY STORAGE – FIXED)
// router.put(
//   "/photo/:id",
//   uploadMemory.single("photo"),
//   updatePhoto
// );

// // GET ALL USERS
// router.get("/", getAllUsers);

// export default router;



//uper vala sahi hai








//niche vala code login dubara na ho uske liye hai --

// import express from "express";
// import multer from "multer";

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
// // ⭐ MULTER CONFIG
// // ======================

// // 🔹 1. Disk storage (SIGNUP images – unchanged)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // 🔹 2. Memory storage (PROFILE PHOTO UPDATE – NEW)
// const uploadMemory = multer({
//   storage: multer.memoryStorage(),
// });

// // ======================
// // ⭐ ALL ROUTES
// // ======================

// // ✅ SIGNUP (With Files – DISK STORAGE) - No auth required
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

// // LOGIN - No auth required
// router.post("/login", login);

// // GET ALL USERS - No auth required (or add auth if needed)
// router.get("/", getAllUsers);

// // 🔒 PROTECTED ROUTES (All require authentication)

// // GET USER BY ID (PROTECTED)
// router.get("/:id", authMiddleware, getUser);

// // UPDATE PROFILE (NAME) (PROTECTED)
// router.put("/:id", authMiddleware, updateProfile);

// // UPDATE PASSWORD (PROTECTED)
// router.put("/password/:id", authMiddleware, updatePassword);

// // UPDATE PHOTO (PROTECTED)
// router.put(
//   "/photo/:id",
//   authMiddleware,
//   uploadMemory.single("photo"),
//   updatePhoto
// );

// export default router;



//ye uper vala sahi hai 




























import express from "express";
import multer from "multer";

// ⭐ IMPORT AUTH MIDDLEWARE
import authMiddleware from "../middlewares/authMiddleware.js";

// ⭐ IMPORT SIGNUP CONTROLLER
import { signup } from "../controllers/signupController.js";

// ⭐ IMPORT USER CONTROLLERS
import {
  getUser,
  updateProfile,
  updatePassword,
  updatePhoto,
  getAllUsers,
} from "../controllers/userController.js";

import { login } from "../controllers/loginController.js";

const router = express.Router();

// ======================
// ⭐ MULTER CONFIG
// ======================

// 🔹 1. Disk storage for signup (multiple files)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// 🔹 2. Memory storage for profile photo updates
const memoryStorage = multer.memoryStorage();

// 🔹 Create two different upload instances
const uploadDisk = multer({ storage: diskStorage });
const uploadMemory = multer({ storage: memoryStorage });

// ======================
// ⭐ ALL ROUTES
// ======================

// ✅ SIGNUP (With Files – DISK STORAGE) - No auth required
router.post(
  "/signup",
  uploadDisk.fields([
    { name: "profile", maxCount: 1 },
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "savingImg", maxCount: 1 },
  ]),
  signup
);

// ✅ LOGIN - No auth required
router.post("/login", login);

// ✅ GET ALL USERS - No auth required (or add auth if needed)
router.get("/", getAllUsers);

// 🔒 PROTECTED ROUTES (All require authentication)

// ✅ GET USER BY ID (PROTECTED)
router.get("/:id", authMiddleware, getUser);

// ✅ UPDATE PROFILE (NAME) (PROTECTED)
router.put("/:id", authMiddleware, updateProfile);

// ✅ UPDATE PASSWORD (PROTECTED)
router.put("/password/:id", authMiddleware, updatePassword);

// ✅ UPDATE PHOTO (PROTECTED) - Using memory storage
router.put(
  "/photo/:id",
  authMiddleware,
  uploadMemory.single("photo"),
  updatePhoto
);

export default router;










