













// // routes/imageRoutes.js - FIXED VERSION
// import express from "express";
// import User from "../models/userModel.js";
// import Farmer from "../models/farmerModel.js";
// import Dealer from "../models/dealerModel.js";

// const router = express.Router();

// // ✅ Route 1: For user images (with imageType)
// router.get("/:userId/:imageType", async (req, res) => {
//   try {
//     const { userId, imageType } = req.params;
    
//     let selectField = "";
//     switch(imageType) {
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
    
//     const user = await User.findById(userId).select(selectField);
    
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const imageData = user[selectField]?.data;
//     const contentType = user[selectField]?.contentType;

//     if (!imageData || !contentType) {
//       return res.status(404).json({ error: "Image not found" });
//     }

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

// // ✅ Route 2: For farmer, pond, dealer images
// router.get("/farmer/photo/:farmerId", async (req, res) => {
//   try {
//     const { farmerId } = req.params;
    
//     const farmer = await Farmer.findOne({
//       $or: [
//         { _id: farmerId },
//         { farmerId: farmerId }
//       ]
//     }).select("photo");
    
//     if (!farmer || !farmer.photo) {
//       return res.status(404).json({ error: "Farmer image not found" });
//     }
    
//     res.set({
//       "Content-Type": "image/jpeg",
//       "Content-Length": farmer.photo.length,
//       "Cache-Control": "public, max-age=31536000"
//     });
    
//     return res.send(farmer.photo);
    
//   } catch (error) {
//     console.error("Error fetching farmer photo:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ Route 3: For pond image
// router.get("/pond/image/:pondId", async (req, res) => {
//   try {
//     const { pondId } = req.params;
    
//     const farmer = await Farmer.findOne({ 
//       "ponds.pondId": pondId 
//     }).select("ponds.$");
    
//     if (!farmer || !farmer.ponds?.[0]?.pondImage) {
//       return res.status(404).json({ error: "Pond image not found" });
//     }
    
//     res.set({
//       "Content-Type": "image/jpeg",
//       "Content-Length": farmer.ponds[0].pondImage.length,
//       "Cache-Control": "public, max-age=31536000"
//     });
    
//     return res.send(farmer.ponds[0].pondImage);
    
//   } catch (error) {
//     console.error("Error fetching pond image:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ Route 4: For pond file by index
// router.get("/pond/file/:pondId/:fileIndex", async (req, res) => {
//   try {
//     const { pondId, fileIndex } = req.params;
//     const index = parseInt(fileIndex);
    
//     const farmer = await Farmer.findOne({ 
//       "ponds.pondId": pondId 
//     }).select("ponds.$");
    
//     if (!farmer || !farmer.ponds?.[0]?.pondFiles?.[index]) {
//       return res.status(404).json({ error: "Pond file not found" });
//     }
    
//     res.set({
//       "Content-Type": "image/jpeg",
//       "Content-Length": farmer.ponds[0].pondFiles[index].length,
//       "Cache-Control": "public, max-age=31536000"
//     });
    
//     return res.send(farmer.ponds[0].pondFiles[index]);
    
//   } catch (error) {
//     console.error("Error fetching pond file:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ Route 5: For fish file by index
// router.get("/fish/file/:pondId/:fileIndex", async (req, res) => {
//   try {
//     const { pondId, fileIndex } = req.params;
//     const index = parseInt(fileIndex);
    
//     const farmer = await Farmer.findOne({ 
//       "ponds.pondId": pondId 
//     }).select("ponds.$");
    
//     if (!farmer || !farmer.ponds?.[0]?.fishFiles?.[index]) {
//       return res.status(404).json({ error: "Fish file not found" });
//     }
    
//     res.set({
//       "Content-Type": "image/jpeg",
//       "Content-Length": farmer.ponds[0].fishFiles[index].length,
//       "Cache-Control": "public, max-age=31536000"
//     });
    
//     return res.send(farmer.ponds[0].fishFiles[index]);
    
//   } catch (error) {
//     console.error("Error fetching fish file:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;























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

// ✅ Route 4: For pond file by index - FIXED VERSION
router.get("/pond/file/:pondId/:fileIndex", async (req, res) => {
  try {
    const { pondId, fileIndex } = req.params;
    const index = parseInt(fileIndex);
    
    console.log(`🔍 Fetching pond file ${index} for pondId: ${pondId}`);
    
    const farmers = await Farmer.find({ 
      "ponds.pondId": pondId 
    });
    
    let pondFiles = null;
    
    for (const farmer of farmers) {
      const pond = farmer.ponds.find(p => p.pondId === pondId);
      if (pond && pond.pondFiles && pond.pondFiles.length > index) {
        pondFiles = pond.pondFiles;
        break;
      }
    }
    
    if (!pondFiles || pondFiles.length <= index) {
      console.log(`❌ Pond file not found at index ${index} for: ${pondId}`);
      return res.status(404).json({ error: "Pond file not found" });
    }
    
    res.set({
      "Content-Type": "image/jpeg",
      "Content-Length": pondFiles[index].length,
      "Cache-Control": "public, max-age=31536000"
    });
    
    return res.send(pondFiles[index]);
    
  } catch (error) {
    console.error("Error fetching pond file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Route 5: For fish file by index - FIXED VERSION
router.get("/fish/file/:pondId/:fileIndex", async (req, res) => {
  try {
    const { pondId, fileIndex } = req.params;
    const index = parseInt(fileIndex);
    
    console.log(`🔍 Fetching fish file ${index} for pondId: ${pondId}`);
    
    const farmers = await Farmer.find({ 
      "ponds.pondId": pondId 
    });
    
    let fishFiles = null;
    
    for (const farmer of farmers) {
      const pond = farmer.ponds.find(p => p.pondId === pondId);
      if (pond && pond.fishFiles && pond.fishFiles.length > index) {
        fishFiles = pond.fishFiles;
        break;
      }
    }
    
    if (!fishFiles || fishFiles.length <= index) {
      console.log(`❌ Fish file not found at index ${index} for: ${pondId}`);
      return res.status(404).json({ error: "Fish file not found" });
    }
    
    res.set({
      "Content-Type": "image/jpeg",
      "Content-Length": fishFiles[index].length,
      "Cache-Control": "public, max-age=31536000"
    });
    
    return res.send(fishFiles[index]);
    
  } catch (error) {
    console.error("Error fetching fish file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;


//uper vala sahi hai 













