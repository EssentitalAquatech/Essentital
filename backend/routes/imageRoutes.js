// import express from "express";
// import User from "../models/userModel.js";

// const router = express.Router();

// // Get image by user ID and image type
// router.get("/:userId/:imageType", async (req, res) => {
//   try {
//     const { userId, imageType } = req.params;
    
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     let imageData, contentType;
    
//     switch (imageType) {
//       case "profile":
//         imageData = user.profilePic?.data;
//         contentType = user.profilePic?.contentType;
//         break;
//       case "aadharFront":
//         imageData = user.aadharFront?.data;
//         contentType = user.aadharFront?.contentType;
//         break;
//       case "aadharBack":
//         imageData = user.aadharBack?.data;
//         contentType = user.aadharBack?.contentType;
//         break;
//       case "pan":
//         imageData = user.panCard?.data;
//         contentType = user.panCard?.contentType;
//         break;
//       case "savingImg":
//         imageData = user.savingAccountImage?.data;
//         contentType = user.savingAccountImage?.contentType;
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid image type" });
//     }

//     if (!imageData || !contentType) {
//       return res.status(404).json({ error: "Image not found" });
//     }

//     // Set content type and send image
//     res.set("Content-Type", contentType);
//     res.send(imageData);
    
//   } catch (error) {
//     console.error("Error fetching image:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;
















import express from "express";
import User from "../models/userModel.js";
import Farmer from "../models/farmerModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

/* ================= FIX __dirname ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =================================================
   ✅ USER IMAGES (OLD – KEEP EXACTLY SAME)
   URL: /api/images/:userId/:imageType
================================================= */
router.get("/:userId/:imageType", async (req, res) => {
  try {
    const { userId, imageType } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).end();

    let imageData, contentType;

    switch (imageType) {
      case "profile":
        imageData = user.profilePic?.data;
        contentType = user.profilePic?.contentType;
        break;
      case "aadharFront":
        imageData = user.aadharFront?.data;
        contentType = user.aadharFront?.contentType;
        break;
      case "aadharBack":
        imageData = user.aadharBack?.data;
        contentType = user.aadharBack?.contentType;
        break;
      case "pan":
        imageData = user.panCard?.data;
        contentType = user.panCard?.contentType;
        break;
      case "savingImg":
        imageData = user.savingAccountImage?.data;
        contentType = user.savingAccountImage?.contentType;
        break;
      default:
        return res.status(400).end();
    }

    if (!imageData || !contentType) return res.status(404).end();

    res.setHeader("Content-Type", contentType);
    res.send(imageData);
  } catch (err) {
    console.error("❌ USER IMAGE ERROR:", err);
    res.status(500).end();
  }
});

/* =================================================
   ✅ FARMER PHOTO (NEW – SAFE & PRODUCTION READY)
   URL: /api/images/farmer/:farmerId/photo
================================================= */
router.get("/farmer/:farmerId/photo", async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.farmerId);
    if (!farmer || !farmer.photo) {
      return res.status(404).end();
    }

    // 🔥 REAL FILE PATH
    const imgPath = path.join(__dirname, "../uploads", farmer.photo);

    if (!fs.existsSync(imgPath)) {
      return res.status(404).end();
    }

    const ext = path.extname(imgPath).toLowerCase();
    const typeMap = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp"
    };

    res.setHeader("Content-Type", typeMap[ext] || "image/png");
    res.sendFile(imgPath);
  } catch (err) {
    console.error("❌ FARMER IMAGE ERROR:", err);
    res.status(500).end();
  }
});

export default router;
