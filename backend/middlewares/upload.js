









import multer from "multer";
import path from "path";

// ===== STORAGE CONFIG =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ===== FILE FILTER (IMAGES + VIDEOS) =====
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;



// //ye uper vala sahi hai 














// // uploadConfig.js या multer configuration
// import multer from "multer";
// import path from "path";

// // ===== STORAGE CONFIG =====
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads"); // ✅ सीधे uploads folder में
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // ✅ सिर्फ filename
//   }
// });

// // ===== FILE FILTER =====
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images and videos are allowed!"), false);
//   }
// };

// const upload = multer({ 
//   storage, 
//   fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   }
// });

// export default upload;