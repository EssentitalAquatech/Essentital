

// import express from "express";
// import multer from "multer";
// import Farmer from "../models/farmerModel.js";
// import {
//   addFarmer,
//   getFarmers,
//   updateFarmer,
//   getFarmersByAgent
// } from "../controllers/farmerController.js";

// const router = express.Router();

// /* ===============================
//    MULTER CONFIG
// ================================ */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname)
// });

// const upload = multer({ storage });

// /* ===============================
//    GET FARMERS BY AGENT (WITH ACCESS CONTROL)
// ================================ */
// router.get("/by-agent", getFarmersByAgent);

// /* ===============================
//    ADD FARMER
// ================================ */
// router.post(
//   "/add",
//   upload.fields([
//     { name: "photo", maxCount: 1 },
//     { name: "pondImage", maxCount: 1 },
//     { name: "pondFiles", maxCount: 20 },
//     { name: "fishFiles", maxCount: 20 }
//   ]),
//   addFarmer
// );

// /* ===============================
//    GET FARMERS
// ================================ */
// router.get("/all", getFarmers);

// /* ===============================
//    UPDATE FARMER
// ================================ */
// router.put(
//   "/update/:id",
//   upload.fields([
//     { name: "photo", maxCount: 1 },
//     { name: "pondImage", maxCount: 1 },
//     { name: "pondFiles", maxCount: 20 },
//     { name: "fishFiles", maxCount: 20 }
//   ]),
//   updateFarmer
// );

// /* ===============================
//    ADD POND
// ================================ */
// router.post(
//   "/add-pond/:farmerId",
//   upload.fields([
//     { name: "pondImage", maxCount: 1 },
//     { name: "pondFiles", maxCount: 20 },
//     { name: "fishFiles", maxCount: 20 }
//   ]),
//   async (req, res) => {
//     try {
//       const { farmerId } = req.params;
//       const pondData = req.body;

//       const farmer = await Farmer.findById(farmerId);
//       if (!farmer)
//         return res.status(404).json({ error: "Farmer not found" });

//       const pondNumber = getNextPondNumber(farmer);
//       const pondId = `${farmer.farmerId}-P${pondNumber}`;

//       const newPond = {
//         pondId,
//         pondNumber,
//         ...pondData,
//         pondImage: req.files?.pondImage?.[0]?.filename || "",
//         pondFiles: req.files?.pondFiles?.map(f => f.filename) || [],
//         fishFiles: req.files?.fishFiles?.map(f => f.filename) || [],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       farmer.ponds.push(newPond);
//       farmer.pondCount = farmer.ponds.length;

//       await farmer.save();

//       res.json({ success: true, farmer });
//     } catch (err) {
//       console.error("ADD POND ERROR:", err);
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// /* ===============================
//    UPDATE POND ✅ FINAL + HISTORY
// ================================ */
// router.put(
//   "/update-pond/:farmerId/:pondId",
//   upload.fields([
//     { name: "pondImage", maxCount: 1 },
//     { name: "pondFiles", maxCount: 20 },
//     { name: "fishFiles", maxCount: 20 }
//   ]),
//   async (req, res) => {
//     try {
//       const { farmerId, pondId } = req.params;
//       const updateData = req.body;

//       const farmer = await Farmer.findById(farmerId);
//       if (!farmer)
//         return res.status(404).json({ error: "Farmer not found" });

//       const pondIndex = farmer.ponds.findIndex(
//         p => p.pondId === pondId
//       );
//       if (pondIndex === -1)
//         return res.status(404).json({ error: "Pond not found" });

//       /* ===============================
//          DATE SAFETY
//       ================================ */
//       if (updateData.dateOfStocking) {
//         updateData.dateOfStocking = new Date(updateData.dateOfStocking);
//       }
//       if (updateData.farmObservedDate) {
//         updateData.farmObservedDate = new Date(updateData.farmObservedDate);
//       }

//       /* ===============================
//          🔥 SAVE POND HISTORY
//       ================================ */
//       const oldPond = farmer.ponds[pondIndex].toObject();
//       const changes = {};

//       Object.keys(updateData).forEach(key => {
//         if (oldPond[key] != updateData[key]) {
//           changes[`pond.${key}`] = {
//             old: oldPond[key] || "N/A",
//             new: updateData[key]
//           };
//         }
//       });

//       if (Object.keys(changes).length > 0) {
//         farmer.updates.push({
//           snapshot: {
//             pondId: oldPond.pondId,
//             pondNumber: oldPond.pondNumber
//           },
//           changes,
//           createdAt: new Date()
//         });
//       }

//       /* ===============================
//          UPDATE POND (ID SAFE)
//       ================================ */
//       farmer.ponds[pondIndex] = {
//         ...oldPond,

//         // 🔒 pondId & pondNumber NEVER CHANGE
//         pondId: oldPond.pondId,
//         pondNumber: oldPond.pondNumber,

//         ...updateData,

//         pondImage:
//           req.files?.pondImage?.[0]?.filename ||
//           oldPond.pondImage,

//         pondFiles: req.files?.pondFiles
//           ? req.files.pondFiles.map(f => f.filename)
//           : oldPond.pondFiles,

//         fishFiles: req.files?.fishFiles
//           ? req.files.fishFiles.map(f => f.filename)
//           : oldPond.fishFiles,

//         updatedAt: new Date()
//       };

//       await farmer.save();

//       res.json({ success: true, farmer });
//     } catch (err) {
//       console.error("UPDATE POND ERROR:", err);
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// /* ===============================
//    HELPER
// ================================ */
// function getNextPondNumber(farmer) {
//   if (!farmer.ponds || farmer.ponds.length === 0) return 1;
//   return Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1;
// }

// export default router;







// // uper vala sahi hai 











import express from "express";
import multer from "multer";
import Farmer from "../models/farmerModel.js";
import {
  addFarmer,
  getFarmers,
  updateFarmer,
  getFarmersByAgent,
  getFarmerById,
  deleteFarmer,
  addPondWithValidation,
  updatePondWithValidation,
  getFarmerFile,
  getPondFileUrls
} from "../controllers/farmerController.js";

const router = express.Router();

/* ===============================
   MULTER CONFIG FOR BINARY UPLOAD
================================ */
// Memory storage for binary uploads (CHANGED FROM diskStorage)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit (ADDED)
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos (ADDED)
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed!"), false);
    }
  }
});

/* ===============================
   GET FARMERS BY AGENT (WITH ACCESS CONTROL)
================================ */
router.get("/by-agent", getFarmersByAgent);

/* ===============================
   ADD FARMER
================================ */
router.post(
  "/add",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  addFarmer
);

/* ===============================
   GET FARMERS
================================ */
router.get("/all", getFarmers);

/* ===============================
   GET SINGLE FARMER (ADDED)
================================ */
router.get("/:id", getFarmerById);

/* ===============================
   DELETE FARMER (ADDED)
================================ */
router.delete("/:id", deleteFarmer);

/* ===============================
   UPDATE FARMER
================================ */
router.put(
  "/update/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  updateFarmer
);

/* ===============================
   ADD POND WITH VALIDATION (UPDATED)
================================ */
router.post(
  "/add-pond/:farmerId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  addPondWithValidation  // CHANGED FROM inline function to controller
);

/* ===============================
   UPDATE POND WITH VALIDATION (UPDATED)
================================ */
router.put(
  "/update-pond/:farmerId/:pondId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  updatePondWithValidation  // CHANGED FROM inline function to controller
);

/* ===============================
   GET FILE FROM DATABASE (NEW ENDPOINTS FOR BINARY FILES)
================================ */
router.get("/file/:id/:fileType", getFarmerFile);
router.get("/file/:id/:fileType/:fileIndex", getFarmerFile);

/* ===============================
   GET POND FILE URLS (NEW ENDPOINT FOR FRONTEND)
================================ */
router.get("/pond-files/:farmerId/:pondId", getPondFileUrls);

export default router;