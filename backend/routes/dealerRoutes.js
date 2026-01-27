


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












//buffer--
import express from "express";
import upload from "../middlewares/uploads.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getDealers,
  getDealerById,
  addDealer,
  updateDealer
} from "../controllers/dealerController.js";

// ✅ Import Dealer model for image endpoint
import Dealer from "../models/dealerModel.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get("/", getDealers);
router.get("/:id", getDealerById);
router.post("/", upload.single("image"), addDealer);
router.put("/:id", upload.single("image"), updateDealer);

// ✅ ADD THIS NEW IMAGE ENDPOINT
router.get("/:id/image", async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer || !dealer.image || !dealer.image.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Set headers for image response
    res.set({
      'Content-Type': dealer.image.contentType,
      'Content-Length': dealer.image.data.length,
      'Cache-Control': 'public, max-age=86400', // 24 hours cache
      'Last-Modified': new Date(dealer.updatedAt).toUTCString()
    });

    // Send image buffer directly
    res.send(dealer.image.data);
  } catch (err) {
    console.error("Error fetching dealer image:", err);
    
    // Handle invalid ID format
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid dealer ID" });
    }
    
    res.status(500).json({ error: err.message });
  }
});

export default router;