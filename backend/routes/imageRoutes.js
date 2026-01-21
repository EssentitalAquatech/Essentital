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

const router = express.Router();

/* ================= USER IMAGES (OLD - KEEP AS IS) ================= */
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

    if (!imageData) return res.status(404).end();

    res.set("Content-Type", contentType);
    res.send(imageData);

  } catch (err) {
    console.error("User image error:", err);
    res.status(500).end();
  }
});

/* ================= FARMER IMAGE (NEW - ADD THIS) ================= */
router.get("/farmer/:farmerId/photo", async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.farmerId);
    if (!farmer || !farmer.photo) return res.status(404).end();

    const imgPath = path.resolve(farmer.photo);
    if (!fs.existsSync(imgPath)) return res.status(404).end();

    const ext = path.extname(imgPath).toLowerCase();
    const typeMap = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp"
    };

    res.set("Content-Type", typeMap[ext] || "image/png");
    res.send(fs.readFileSync(imgPath));

  } catch (err) {
    console.error("Farmer image error:", err);
    res.status(500).end();
  }
});

export default router;
