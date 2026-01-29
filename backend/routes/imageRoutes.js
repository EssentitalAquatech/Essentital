







// // routes/imageRoutes.js

// import express from "express";
// import User from "../models/userModel.js";

// const router = express.Router();

// // Get image by user ID and image type
// router.get("/:userId/:imageType", async (req, res) => {
//   try {
//     const { userId, imageType } = req.params;
    
//     // Select specific image field
//     let selectField = "";
//     switch (imageType) {
//       case "profile":
//         selectField = "profilePic";
//         break;
//       case "aadharFront":
//         selectField = "aadharFront";
//         break;
//       case "aadharBack":
//         selectField = "aadharBack";
//         break;
//       case "pan":
//         selectField = "panCard";
//         break;
//       case "savingImg":
//         selectField = "savingAccountImage";
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid image type" });
//     }
    
//     // Get user with specific image field
//     const user = await User.findById(userId).select(selectField);
    
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const imageData = user[selectField]?.data;
//     const contentType = user[selectField]?.contentType;

//     if (!imageData || !contentType) {
//       return res.status(404).json({ error: "Image not found" });
//     }

//     // Set headers and send buffer
//     res.set({
//       "Content-Type": contentType,
//       "Content-Length": imageData.length,
//       "Cache-Control": "public, max-age=31536000"
//     });
    
//     res.send(imageData);
    
//   } catch (error) {
//     console.error("Error fetching image:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;






// // //ye uper vala buffer ke liye sahi hai 














// routes/imageRoutes.js - FIXED VERSION
import express from "express";
import User from "../models/userModel.js";
import Farmer from "../models/farmerModel.js";
import Dealer from "../models/dealerModel.js";

const router = express.Router();

// ✅ Route 1: For user images (with imageType)
router.get("/:userId/:imageType", async (req, res) => {
  try {
    const { userId, imageType } = req.params;
    
    let selectField = "";
    switch(imageType) {
      case "profile":
        selectField = "profilePic";
        break;
      case "aadharFront":
        selectField = "aadharFront";
        break;
      case "aadharBack":
        selectField = "aadharBack";
        break;
      case "pan":
        selectField = "panCard";
        break;
      case "savingImg":
        selectField = "savingAccountImage";
        break;
      default:
        return res.status(400).json({ error: "Invalid image type" });
    }
    
    const user = await User.findById(userId).select(selectField);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const imageData = user[selectField]?.data;
    const contentType = user[selectField]?.contentType;

    if (!imageData || !contentType) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set({
      "Content-Type": contentType,
      "Content-Length": imageData.length,
      "Cache-Control": "public, max-age=31536000"
    });
    
    res.send(imageData);
    
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Route 2: For farmer, pond, dealer images
router.get("/farmer/photo/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const farmer = await Farmer.findOne({
      $or: [
        { _id: farmerId },
        { farmerId: farmerId }
      ]
    }).select("photo");
    
    if (!farmer || !farmer.photo) {
      return res.status(404).json({ error: "Farmer image not found" });
    }
    
    res.set({
      "Content-Type": "image/jpeg",
      "Content-Length": farmer.photo.length,
      "Cache-Control": "public, max-age=31536000"
    });
    
    return res.send(farmer.photo);
    
  } catch (error) {
    console.error("Error fetching farmer photo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Route 3: For pond image
router.get("/pond/image/:pondId", async (req, res) => {
  try {
    const { pondId } = req.params;
    
    const farmer = await Farmer.findOne({ 
      "ponds.pondId": pondId 
    }).select("ponds.$");
    
    if (!farmer || !farmer.ponds?.[0]?.pondImage) {
      return res.status(404).json({ error: "Pond image not found" });
    }
    
    res.set({
      "Content-Type": "image/jpeg",
      "Content-Length": farmer.ponds[0].pondImage.length,
      "Cache-Control": "public, max-age=31536000"
    });
    
    return res.send(farmer.ponds[0].pondImage);
    
  } catch (error) {
    console.error("Error fetching pond image:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Route 4: For pond file by index
router.get("/pond/file/:pondId/:fileIndex", async (req, res) => {
  try {
    const { pondId, fileIndex } = req.params;
    const index = parseInt(fileIndex);
    
    const farmer = await Farmer.findOne({ 
      "ponds.pondId": pondId 
    }).select("ponds.$");
    
    if (!farmer || !farmer.ponds?.[0]?.pondFiles?.[index]) {
      return res.status(404).json({ error: "Pond file not found" });
    }
    
    res.set({
      "Content-Type": "image/jpeg",
      "Content-Length": farmer.ponds[0].pondFiles[index].length,
      "Cache-Control": "public, max-age=31536000"
    });
    
    return res.send(farmer.ponds[0].pondFiles[index]);
    
  } catch (error) {
    console.error("Error fetching pond file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Route 5: For fish file by index
router.get("/fish/file/:pondId/:fileIndex", async (req, res) => {
  try {
    const { pondId, fileIndex } = req.params;
    const index = parseInt(fileIndex);
    
    const farmer = await Farmer.findOne({ 
      "ponds.pondId": pondId 
    }).select("ponds.$");
    
    if (!farmer || !farmer.ponds?.[0]?.fishFiles?.[index]) {
      return res.status(404).json({ error: "Fish file not found" });
    }
    
    res.set({
      "Content-Type": "image/jpeg",
      "Content-Length": farmer.ponds[0].fishFiles[index].length,
      "Cache-Control": "public, max-age=31536000"
    });
    
    return res.send(farmer.ponds[0].fishFiles[index]);
    
  } catch (error) {
    console.error("Error fetching fish file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;