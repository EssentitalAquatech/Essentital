









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



// // //ye uper vala sahi hai 






// // middlewares/uploads.js
// import multer from "multer";

// // MEMORY STORAGE
// const storage = multer.memoryStorage();

// // FILE FILTER (images only)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;








// middlewares/uploads.js
import multer from "multer";

// MEMORY STORAGE
const storage = multer.memoryStorage();

// FILE FILTER (images/videos)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;












// // middleware/upload.js
// import multer from "multer";

// // ✅ PURE MEMORY STORAGE - NO DISK
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   // Accept only images
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Not an image! Please upload only images.'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit per file
//     files: 5 // Max 5 files
//   }
// });

// export default upload;