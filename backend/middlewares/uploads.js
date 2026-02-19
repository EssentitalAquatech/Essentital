





// // middlewares/uploads.js
// // middlewares/uploads.js

// import multer from "multer";

// // MEMORY STORAGE FOR BUFFER HANDLING
// const storage = multer.memoryStorage();

// // FILE FILTER (images/videos)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images and videos are allowed"), false);
//   }
// };

// // Create multer instance with memory storage
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 50 * 1024 * 1024, // 50MB limit
//   }
// });

// export default upload;









//uper vala sahi hai 














import multer from "multer";

// Use memory storage (since we're uploading to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

export default upload;