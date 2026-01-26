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







//uper vala sahi hai 








// routes/imageRoutes.js
import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Get image by user ID and image type
router.get("/:userId/:imageType", async (req, res) => {
  try {
    const { userId, imageType } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
        return res.status(400).json({ error: "Invalid image type" });
    }

    if (!imageData || !contentType) {
      return res.status(404).json({ error: "Image not found for this user" });
    }

    // Set appropriate headers and send image
    res.set({
      "Content-Type": contentType,
      "Content-Length": imageData.length,
      "Cache-Control": "public, max-age=31536000" // 1 year cache
    });
    
    res.send(imageData);
    
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Server error while fetching image" });
  }
});

export default router;