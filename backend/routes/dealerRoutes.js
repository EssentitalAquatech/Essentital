


// // routes/dealerRoutes.js
// import express from "express";
// import multer from "multer";
// import path from "path";
// import { 
//   getDealers, 
//   getDealerById,  // ✅ Yeh import hona chahiye
//   addDealer, 
//   updateDealer 
// } from "../controllers/dealerController.js"; // ✅ Path sahi hai?

// const router = express.Router();

// // Multer setup for image upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}${ext}`);
//   }
// });

// const upload = multer({ storage });

// // Routes
// router.get("/", getDealers); // GET /api/dealers
// router.get("/:id", getDealerById); // ✅ GET /api/dealers/:id
// router.post("/", upload.single("image"), addDealer); // POST /api/dealers
// router.put("/:id", upload.single("image"), updateDealer); // PUT /api/dealers/:id

// export default router;



//ye uper vala sahi 




import express from "express";
import upload from "../middleware/upload.js"; // ✅ YAHI SE
import {
  getDealers,
  getDealerById,
  addDealer,
  updateDealer
} from "../controllers/dealerController.js";

const router = express.Router();

router.get("/", getDealers);
router.get("/:id", getDealerById);
router.post("/", upload.single("image"), addDealer);
router.put("/:id", upload.single("image"), updateDealer);

export default router;
