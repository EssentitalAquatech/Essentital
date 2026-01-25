// import multer from "multer";
// import path from "path";

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // uploads फोल्डर में file save होगी
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // File filter (optional)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true); // सिर्फ images allow
//   } else {
//     cb(new Error("Only images are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;










// import multer from "multer";
// import path from "path";

// // ===== STORAGE CONFIG =====
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads"),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // ===== FILE FILTER (IMAGES + VIDEOS) =====
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images and videos are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;



//ye uper vala sahi hai 




import express from "express";
import upload from "../middleware/uploads.js";

const router = express.Router();

// Single file upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  res.send({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// Multiple files
router.post("/uploads", upload.array("files", 5), (req, res) => {
  const files = req.files.map(f => ({ filename: f.filename, path: `/uploads/${f.filename}` }));
  res.send({ files });
});

export default router;


