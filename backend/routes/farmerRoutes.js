

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













//buffer ke liye
import express from "express";
import upload from "../middlewares/uploads.js";
import Farmer from "../models/farmerModel.js";
import Counter from "../models/counterModel.js";
import {
  addFarmer,
  getFarmers,
  updateFarmer,
  getFarmersByAgent,
  getFarmerById
} from "../controllers/farmerController.js";

const router = express.Router();

/* ===============================
   GET FARMERS
================================ */
router.get("/all", getFarmers);

/* ===============================
   GET FARMERS BY AGENT (WITH ACCESS CONTROL)
================================ */
router.get("/by-agent", getFarmersByAgent);

/* ===============================
   GET FARMER BY ID
================================ */
router.get("/:id", getFarmerById);

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
   ADD POND
================================ */
router.post(
  "/add-pond/:farmerId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      console.log("📝 ADD POND REQUEST:", req.params, req.body);
      console.log("📸 ADD POND FILES:", req.files);

      const { farmerId } = req.params;
      const pondData = req.body;

      const farmer = await Farmer.getFarmerByAnyId(farmerId);
      if (!farmer) {
        console.log("❌ Farmer not found:", farmerId);
        return res.status(404).json({ error: "Farmer not found" });
      }

      console.log("✅ Farmer found:", farmer.farmerId);

      // ✅ Validate required fields
      const requiredPondFields = [
        'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
        'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
        'farmObservedDate', 'farmObservedTime'
      ];
      
      const missingFields = [];
      for (const field of requiredPondFields) {
        if (!pondData[field] || pondData[field].toString().trim() === '') {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required pond fields: ${missingFields.join(', ')}` 
        });
      }

      // Validate files
      if (!req.files?.pondImage?.[0]) {
        return res.status(400).json({ error: "Pond image is required" });
      }

      const pondNumber = getNextPondNumber(farmer);
      const pondId = `${farmer.farmerId}-P${pondNumber}`;

      console.log("🔢 Generated Pond ID:", pondId, "Pond Number:", pondNumber);

      // ✅ Date parsing for safety
      if (pondData.dateOfStocking) {
        pondData.dateOfStocking = new Date(pondData.dateOfStocking);
      }
      if (pondData.farmObservedDate) {
        pondData.farmObservedDate = new Date(pondData.farmObservedDate);
      }

      // ✅ Create new pond with ALL required fields from schema
      const newPond = {
        pondId,
        pondNumber,
        
        // Pond Details
        pondArea: pondData.pondArea || "",
        pondAreaUnit: pondData.pondAreaUnit || "acre",
        pondDepth: pondData.pondDepth || "",
        pondImage: req.files?.pondImage?.[0]?.buffer || Buffer.from([]),
        
        overflow: pondData.overflow || "No",
        receivesSunlight: pondData.receivesSunlight || "Yes",
        treesOnBanks: pondData.treesOnBanks || "No",
        neighbourhood: pondData.neighbourhood || "Agriculture Farm",
        wastewaterEnters: pondData.wastewaterEnters || "No",
        
        // Species & Stocking
        species: pondData.species || "",
        dateOfStocking: pondData.dateOfStocking || new Date(),
        qtySeedInitially: pondData.qtySeedInitially || "",
        currentQty: pondData.currentQty || "",
        avgSize: pondData.avgSize || ">200gram",
        
        // Feed Details
        feedType: pondData.feedType || "Market Feed",
        feedOther: pondData.feedOther || "",
        feedFreq: pondData.feedFreq || "Once a day",
        feedQtyPerDay: pondData.feedQtyPerDay || "",
        feedTime: pondData.feedTime || "6:00 am-10:00am",
        recentFeedChanges: pondData.recentFeedChanges || "",
        reducedAppetite: pondData.reducedAppetite || "No",
        
        // Water Quality
        waterTemperature: pondData.waterTemperature || "",
        pH: pondData.pH || "",
        DO: pondData.DO || "",
        ammoniaLevel: pondData.ammoniaLevel || "Medium",
        phytoplanktonLevel: pondData.phytoplanktonLevel || "Medium",
        waterHardness: pondData.waterHardness || "1",
        algaeBloom: pondData.algaeBloom || "No",
        pondWaterColor: pondData.pondWaterColor || "Light Green",
        sourceOfWater: pondData.sourceOfWater || "Rainwater",
        
        // Disease & Symptoms
        diseaseSymptoms: pondData.diseaseSymptoms || "No",
        symptomsObserved: pondData.symptomsObserved || "",
        fishDeaths: pondData.fishDeaths || "",
        symptomsAffect: pondData.symptomsAffect || "All",
        
        // Observation
        farmObservedDate: pondData.farmObservedDate || new Date(),
        farmObservedTime: pondData.farmObservedTime || "",
        
        // History & Environment
        lastSpecies: pondData.lastSpecies || "",
        lastHarvestComplete: pondData.lastHarvestComplete || "Yes",
        recentRainFlood: pondData.recentRainFlood || "No",
        pesticideRunoff: pondData.pesticideRunoff || "No",
        constructionNear: pondData.constructionNear || "No",
        suddenTempChange: pondData.suddenTempChange || "No",
        
        // Notes
        notes: pondData.notes || "",
        
        // Files
        pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
        fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
        
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log("📋 New Pond Data:", {
        pondId: newPond.pondId,
        species: newPond.species,
        pondArea: newPond.pondArea
      });

      farmer.ponds.push(newPond);
      farmer.pondCount = farmer.ponds.length;

      await farmer.save();
      console.log("✅ Pond added successfully");

      // Convert buffers to base64 for response
      const responseFarmer = farmer.toObject();
      if (responseFarmer.photo) {
        responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
      }

      // Convert pond images to base64
      if (responseFarmer.ponds && responseFarmer.ponds.length > 0) {
        responseFarmer.ponds = responseFarmer.ponds.map(pond => {
          if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
            pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
          }
          return pond;
        });
      }

      res.json({ 
        success: true, 
        message: "Pond added successfully",
        farmer: responseFarmer 
      });

    } catch (err) {
      console.error("🔥 ADD POND ERROR:", err);
      res.status(500).json({ 
        error: err.message,
        details: err.stack 
      });
    }
  }
);

/* ===============================
   UPDATE POND ✅ FINAL + HISTORY
================================ */
router.put(
  "/update-pond/:farmerId/:pondId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      console.log("📝 UPDATE POND REQUEST:", req.params, req.body);
      console.log("📸 UPDATE POND FILES:", req.files);

      const { farmerId, pondId } = req.params;
      const updateData = req.body;

      const farmer = await Farmer.getFarmerByAnyId(farmerId);
      if (!farmer) {
        console.log("❌ Farmer not found:", farmerId);
        return res.status(404).json({ error: "Farmer not found" });
      }

      const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
      if (pondIndex === -1) {
        console.log("❌ Pond not found:", pondId);
        return res.status(404).json({ error: "Pond not found" });
      }

      console.log("✅ Found pond at index:", pondIndex);

      /* ===============================
         DATE SAFETY
      ================================ */
      if (updateData.dateOfStocking) {
        updateData.dateOfStocking = new Date(updateData.dateOfStocking);
      }
      if (updateData.farmObservedDate) {
        updateData.farmObservedDate = new Date(updateData.farmObservedDate);
      }

      /* ===============================
         🔥 SAVE POND HISTORY
      ================================ */
      const oldPond = JSON.parse(JSON.stringify(farmer.ponds[pondIndex]));
      const changes = {};

      Object.keys(updateData).forEach(key => {
        if (oldPond[key] != updateData[key]) {
          changes[`pond.${key}`] = {
            old: oldPond[key] || "N/A",
            new: updateData[key]
          };
        }
      });

      if (Object.keys(changes).length > 0) {
        farmer.updates.push({
          snapshot: {
            pondId: oldPond.pondId,
            pondNumber: oldPond.pondNumber,
            ...oldPond
          },
          changes,
          pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
          fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
          updatedBy: updateData.userId || farmer.userId,
          createdAt: new Date()
        });
      }

      /* ===============================
         UPDATE POND (ID SAFE)
      ================================ */
      const updatedPond = {
        ...oldPond,

        // 🔒 pondId & pondNumber NEVER CHANGE
        pondId: oldPond.pondId,
        pondNumber: oldPond.pondNumber,

        // Update all fields from updateData
        ...updateData,

        // Handle file updates
        pondImage: req.files?.pondImage?.[0]?.buffer || oldPond.pondImage,

        pondFiles: req.files?.pondFiles
          ? [
              ...(oldPond.pondFiles || []),
              ...req.files.pondFiles.map(f => f.buffer)
            ]
          : oldPond.pondFiles,

        fishFiles: req.files?.fishFiles
          ? [
              ...(oldPond.fishFiles || []),
              ...req.files.fishFiles.map(f => f.buffer)
            ]
          : oldPond.fishFiles,

        updatedAt: new Date()
      };

      // ✅ Ensure all required fields have values
      const requiredFields = [
        'pondArea', 'pondAreaUnit', 'pondDepth', 'pondImage',
        'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
        'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
        'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime',
        'recentFeedChanges', 'reducedAppetite',
        'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel',
        'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
        'diseaseSymptoms', 'symptomsObserved', 'fishDeaths', 'symptomsAffect',
        'farmObservedDate', 'farmObservedTime',
        'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
        'pesticideRunoff', 'constructionNear', 'suddenTempChange',
        'notes'
      ];

      for (const field of requiredFields) {
        if (!updatedPond[field] && field !== 'feedOther') {
          updatedPond[field] = oldPond[field] || "";
        }
      }

      farmer.ponds[pondIndex] = updatedPond;

      await farmer.save();
      console.log("✅ Pond updated successfully");

      // Convert buffers to base64 for response
      const responseFarmer = farmer.toObject();
      
      // Convert farmer photo
      if (responseFarmer.photo) {
        responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
      }

      // Convert pond images
      if (responseFarmer.ponds && responseFarmer.ponds.length > 0) {
        responseFarmer.ponds = responseFarmer.ponds.map(pond => {
          if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
            pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
          }
          return pond;
        });
      }

      res.json({ 
        success: true, 
        message: "Pond updated successfully",
        farmer: responseFarmer 
      });

    } catch (err) {
      console.error("🔥 UPDATE POND ERROR:", err);
      res.status(500).json({ 
        error: err.message,
        details: err.stack 
      });
    }
  }
);

/* ===============================
   HELPER
================================ */
function getNextPondNumber(farmer) {
  if (!farmer.ponds || farmer.ponds.length === 0) return 1;
  return Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1;
}

export default router;











// import express from "express";
// import multer from "multer";
// import path from "path";
// import {
//   addFarmer,
//   getFarmers,
//   updateFarmer,
//   getFarmersByAgent
// } from "../controllers/farmerController.js";

// const router = express.Router();

// /* ===============================
//    MULTER CONFIG - SIMPLIFIED
// ================================ */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads"); // ✅ Direct to uploads folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // ✅ Filename only
//   }
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB
// });

// /* ===============================
//    ROUTES
// ================================ */
// router.get("/by-agent", getFarmersByAgent);

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

// router.get("/all", getFarmers);

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





















