















// // buffer ke liye
// import express from "express";
// import upload from "../middlewares/uploads.js";
// import Farmer from "../models/farmerModel.js";
// import Counter from "../models/counterModel.js";
// import {
//   addFarmer,
//   getFarmers,
//   updateFarmer,
//   getFarmersByAgent,
//   getFarmerById
// } from "../controllers/farmerController.js";

// const router = express.Router();

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
//       console.log("📝 ADD POND REQUEST:", req.params, req.body);
//       console.log("📸 ADD POND FILES:", req.files);

//       const { farmerId } = req.params;
//       const pondData = req.body;

//       const farmer = await Farmer.getFarmerByAnyId(farmerId);
//       if (!farmer) {
//         console.log("❌ Farmer not found:", farmerId);
//         return res.status(404).json({ error: "Farmer not found" });
//       }

//       console.log("✅ Farmer found:", farmer.farmerId);

//       // ✅✅✅ IMPORTANT: Location ko bhi required fields mein ADD KARO
//       const requiredPondFields = [
//         'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
//         'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
//         'farmObservedDate', 'farmObservedTime',
//         'latitude', 'longitude' // ✅ YAHAN ADD KARO
//       ];
      
//       const missingFields = [];
//       for (const field of requiredPondFields) {
//         if (!pondData[field] || pondData[field].toString().trim() === '') {
//           missingFields.push(field);
//         }
//       }
      
//       if (missingFields.length > 0) {
//         return res.status(400).json({ 
//           error: `Missing required pond fields: ${missingFields.join(', ')}` 
//         });
//       }

//       // Validate files
//       if (!req.files?.pondImage?.[0]) {
//         return res.status(400).json({ error: "Pond image is required" });
//       }

//       const pondNumber = getNextPondNumber(farmer);
//       const pondId = `${farmer.farmerId}-P${pondNumber}`;

//       console.log("🔢 Generated Pond ID:", pondId, "Pond Number:", pondNumber);
//       console.log("📍 Location captured:", { 
//         latitude: pondData.latitude, 
//         longitude: pondData.longitude 
//       });

//       // ✅ Date parsing for safety
//       if (pondData.dateOfStocking) {
//         pondData.dateOfStocking = new Date(pondData.dateOfStocking);
//       }
//       if (pondData.farmObservedDate) {
//         pondData.farmObservedDate = new Date(pondData.farmObservedDate);
//       }

//       // ✅ Create new pond with ALL fields including location
//       const newPond = {
//         pondId,
//         pondNumber,
        
//         // Pond Details
//         pondArea: pondData.pondArea || "",
//         pondAreaUnit: pondData.pondAreaUnit || "acre",
//         pondDepth: pondData.pondDepth || "",
//         pondImage: req.files?.pondImage?.[0]?.buffer || Buffer.from([]),
        
//         // ✅✅✅ Location fields (MOST IMPORTANT)
//         // latitude: pondData.latitude || "",
//         // longitude: pondData.longitude || "",
//          latitude: Number(pondData.latitude),
//          longitude: Number(pondData.longitude),
        
//         overflow: pondData.overflow || "No",
//         receivesSunlight: pondData.receivesSunlight || "Yes",
//         treesOnBanks: pondData.treesOnBanks || "No",
//         neighbourhood: pondData.neighbourhood || "Agriculture Farm",
//         wastewaterEnters: pondData.wastewaterEnters || "No",
        
//         // Species & Stocking
//         species: pondData.species || "",
//         dateOfStocking: pondData.dateOfStocking || new Date(),
//         qtySeedInitially: pondData.qtySeedInitially || "",
//         currentQty: pondData.currentQty || "",
//         avgSize: pondData.avgSize || ">200gram",
        
//         // Feed Details
//         feedType: pondData.feedType || "Market Feed",
//         feedOther: pondData.feedOther || "",
//         feedFreq: pondData.feedFreq || "Once a day",
//         feedQtyPerDay: pondData.feedQtyPerDay || "",
//         feedTime: pondData.feedTime || "6:00 am-10:00am",
//         recentFeedChanges: pondData.recentFeedChanges || "",
//         reducedAppetite: pondData.reducedAppetite || "No",
        
//         // Water Quality
//         waterTemperature: pondData.waterTemperature || "",
//         pH: pondData.pH || "",
//         DO: pondData.DO || "",
//         ammoniaLevel: pondData.ammoniaLevel || "Medium",
//         phytoplanktonLevel: pondData.phytoplanktonLevel || "Medium",
//         waterHardness: pondData.waterHardness || "1",
//         algaeBloom: pondData.algaeBloom || "No",
//         pondWaterColor: pondData.pondWaterColor || "Light Green",
//         sourceOfWater: pondData.sourceOfWater || "Rainwater",
        
//         // Disease & Symptoms
//         diseaseSymptoms: pondData.diseaseSymptoms || "No",
//         symptomsObserved: pondData.symptomsObserved || "",
//         fishDeaths: pondData.fishDeaths || "",
//         symptomsAffect: pondData.symptomsAffect || "All",
        
//         // Observation
//         farmObservedDate: pondData.farmObservedDate || new Date(),
//         farmObservedTime: pondData.farmObservedTime || "",
        
//         // History & Environment
//         lastSpecies: pondData.lastSpecies || "",
//         lastHarvestComplete: pondData.lastHarvestComplete || "Yes",
//         recentRainFlood: pondData.recentRainFlood || "No",
//         pesticideRunoff: pondData.pesticideRunoff || "No",
//         constructionNear: pondData.constructionNear || "No",
//         suddenTempChange: pondData.suddenTempChange || "No",
        
//         // Notes
//         notes: pondData.notes || "",
        
//         // Files
//         pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
//         fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
        
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       console.log("📋 New Pond Data INCLUDING LOCATION:", {
//         pondId: newPond.pondId,
//         latitude: newPond.latitude,
//         longitude: newPond.longitude
//       });

//       farmer.ponds.push(newPond);
//       farmer.pondCount = farmer.ponds.length;

//       await farmer.save();
//       console.log("✅ Pond with location saved successfully");

//       // Convert buffers to base64 for response
//       const responseFarmer = farmer.toObject();
//       if (responseFarmer.photo) {
//         responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
//       }

//       // Convert pond images to base64
//       if (responseFarmer.ponds && responseFarmer.ponds.length > 0) {
//         responseFarmer.ponds = responseFarmer.ponds.map(pond => {
//           if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
//             pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
//           }
//           return pond;
//         });
//       }

//       res.json({ 
//         success: true, 
//         message: "Pond added successfully with location",
//         farmer: responseFarmer 
//       });

//     } catch (err) {
//       console.error("🔥 ADD POND ERROR:", err);
//       res.status(500).json({ 
//         error: err.message,
//         details: err.stack 
//       });
//     }
//   }
// );

// /* ===============================
//    UPDATE POND
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
//       console.log("📝 UPDATE POND REQUEST:", req.params, req.body);
//       console.log("📍 Update Location data:", {
//         latitude: req.body.latitude,
//         longitude: req.body.longitude
//       });

//       const { farmerId, pondId } = req.params;
//       const updateData = req.body;

//       const farmer = await Farmer.getFarmerByAnyId(farmerId);
//       if (!farmer) {
//         return res.status(404).json({ error: "Farmer not found" });
//       }

//       const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
//       if (pondIndex === -1) {
//         return res.status(404).json({ error: "Pond not found" });
//       }

//       // ✅ Date parsing for safety
//       if (updateData.dateOfStocking) {
//         updateData.dateOfStocking = new Date(updateData.dateOfStocking);
//       }
//       if (updateData.farmObservedDate) {
//         updateData.farmObservedDate = new Date(updateData.farmObservedDate);
//       }

//       /* ===============================
//          🔥 SAVE POND HISTORY
//       ================================ */
//       const oldPond = JSON.parse(JSON.stringify(farmer.ponds[pondIndex]));
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
//             pondNumber: oldPond.pondNumber,
//             ...oldPond
//           },
//           changes,
//           pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
//           fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
//           updatedBy: updateData.userId || farmer.userId,
//           createdAt: new Date()
//         });
//       }

//       /* ===============================
//          UPDATE POND (ID SAFE)
//       ================================ */
//       const updatedPond = {
//         ...oldPond,

//         // 🔒 pondId & pondNumber NEVER CHANGE
//         pondId: oldPond.pondId,
//         pondNumber: oldPond.pondNumber,

//         // Update all fields from updateData including location
//         ...updateData,

//         // ✅ Ensure location fields are included
//         // latitude: updateData.latitude || oldPond.latitude || "",
//         // longitude: updateData.longitude || oldPond.longitude || "",
//         latitude: updateData.latitude !== undefined ? Number(updateData.latitude) : oldPond.latitude,
//  longitude: updateData.longitude !== undefined ? Number(updateData.longitude) : oldPond.longitude,

//         // Handle file updates
//         pondImage: req.files?.pondImage?.[0]?.buffer || oldPond.pondImage,

//         pondFiles: req.files?.pondFiles
//           ? [
//               ...(oldPond.pondFiles || []),
//               ...req.files.pondFiles.map(f => f.buffer)
//             ]
//           : oldPond.pondFiles,

//         fishFiles: req.files?.fishFiles
//           ? [
//               ...(oldPond.fishFiles || []),
//               ...req.files.fishFiles.map(f => f.buffer)
//             ]
//           : oldPond.fishFiles,

//         updatedAt: new Date()
//       };

//       // ✅ Ensure all required fields have values
//       const requiredFields = [
//         'pondArea', 'pondAreaUnit', 'pondDepth', 'pondImage',
//         'latitude', 'longitude',
//         'overflow', 'receivesSunlight', 'treesOnBanks', 'neighbourhood', 'wastewaterEnters',
//         'species', 'dateOfStocking', 'qtySeedInitially', 'currentQty', 'avgSize',
//         'feedType', 'feedOther', 'feedFreq', 'feedQtyPerDay', 'feedTime',
//         'recentFeedChanges', 'reducedAppetite',
//         'waterTemperature', 'pH', 'DO', 'ammoniaLevel', 'phytoplanktonLevel',
//         'waterHardness', 'algaeBloom', 'pondWaterColor', 'sourceOfWater',
//         'diseaseSymptoms', 'symptomsObserved', 'fishDeaths', 'symptomsAffect',
//         'farmObservedDate', 'farmObservedTime',
//         'lastSpecies', 'lastHarvestComplete', 'recentRainFlood',
//         'pesticideRunoff', 'constructionNear', 'suddenTempChange',
//         'notes'
//       ];

//       for (const field of requiredFields) {
//         if (!updatedPond[field] && field !== 'feedOther') {
//           updatedPond[field] = oldPond[field] || "";
//         }
//       }

//       farmer.ponds[pondIndex] = updatedPond;

//       await farmer.save();
//       console.log("✅ Pond with location updated successfully");

//       // Convert buffers to base64 for response
//       const responseFarmer = farmer.toObject();
      
//       if (responseFarmer.photo) {
//         responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
//       }

//       if (responseFarmer.ponds && responseFarmer.ponds.length > 0) {
//         responseFarmer.ponds = responseFarmer.ponds.map(pond => {
//           if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
//             pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
//           }
//           return pond;
//         });
//       }

//       res.json({ 
//         success: true, 
//         message: "Pond updated successfully with location",
//         farmer: responseFarmer 
//       });

//     } catch (err) {
//       console.error("🔥 UPDATE POND ERROR:", err);
//       res.status(500).json({ 
//         error: err.message,
//         details: err.stack 
//       });
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

// // Export other routes (unchanged)
// router.get("/all", getFarmers);
// router.get("/by-agent", getFarmersByAgent);
// router.get("/:id", getFarmerById);
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

// export default router;






//bina  selfie vala code hai sahi hai 











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
   ADD POND - FIXED (SELFIE OPTIONAL)
================================ */
router.post(
  "/add-pond/:farmerId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 },
    { name: "uploadSelfie", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("📝 ADD POND REQUEST:", req.params);
      console.log("📸 FILES RECEIVED:", Object.keys(req.files || {}));
      console.log("📸 SELFIE PRESENT:", !!req.files?.uploadSelfie?.[0]);
      
      // 💥 EXTRA SAFETY - Log all incoming body data
      console.log("🧪 BODY DATA:", req.body);

      const { farmerId } = req.params;
      const pondData = req.body;

      const farmer = await Farmer.getFarmerByAnyId(farmerId);
      if (!farmer) {
        console.log("❌ Farmer not found:", farmerId);
        return res.status(404).json({ error: "Farmer not found" });
      }

      console.log("✅ Farmer found:", farmer.farmerId);

      // ✅ REMOVED SELFIE VALIDATION - NOT REQUIRED
      // if (!req.files?.uploadSelfie?.[0]) {
      //   return res.status(400).json({ error: "Selfie image is required" });
      // }

      // ✅ Location and other required fields
      const requiredPondFields = [
        'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
        'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
        'farmObservedDate', 'farmObservedTime',
        'latitude', 'longitude'
      ];
      
      const missingFields = [];
      
      // ✅ ✅ FINAL FIX - Safe Validation Version (No undefined.toString() error)
      for (const field of requiredPondFields) {
        if (
          pondData[field] === undefined ||
          pondData[field] === null ||
          String(pondData[field]).trim() === ""
        ) {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required pond fields: ${missingFields.join(', ')}` 
        });
      }

      // Validate pond image
      if (!req.files?.pondImage?.[0]) {
        return res.status(400).json({ error: "Pond image is required" });
      }

      const pondNumber = getNextPondNumber(farmer);
      const pondId = `${farmer.farmerId}-P${pondNumber}`;

      console.log("🔢 Generated Pond ID:", pondId, "Pond Number:", pondNumber);
      console.log("📍 Location captured:", { 
        latitude: pondData.latitude, 
        longitude: pondData.longitude 
      });

      // ✅ Date parsing for safety
      if (pondData.dateOfStocking) {
        pondData.dateOfStocking = new Date(pondData.dateOfStocking);
      }
      if (pondData.farmObservedDate) {
        pondData.farmObservedDate = new Date(pondData.farmObservedDate);
      }

      // ✅ FIXED: Create new pond with conditional selfie and safe number parsing
      const newPond = {
        pondId,
        pondNumber,
        
        // Pond Details
        pondArea: pondData.pondArea || "",
        pondAreaUnit: pondData.pondAreaUnit || "acre",
        pondDepth: pondData.pondDepth || "",
        pondImage: req.files?.pondImage?.[0]?.buffer || Buffer.from([]),
        
        // ✅ FIXED - Using parseFloat for safe number conversion
        latitude: parseFloat(pondData.latitude),
        longitude: parseFloat(pondData.longitude),
        
        // ✅ FIXED: Only set uploadSelfie if file was provided
        ...(req.files?.uploadSelfie?.[0] && {
          uploadSelfie: req.files.uploadSelfie[0].buffer
        }),
        
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
        latitude: newPond.latitude,
        longitude: newPond.longitude,
        hasSelfie: !!newPond.uploadSelfie
      });

      farmer.ponds.push(newPond);
      farmer.pondCount = farmer.ponds.length;

      await farmer.save();
      console.log("✅ Pond saved successfully. Selfie included:", !!newPond.uploadSelfie);

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
          // ✅ CONVERT SELFIE TO BASE64 IF EXISTS
          if (pond.uploadSelfie && Buffer.isBuffer(pond.uploadSelfie)) {
            pond.uploadSelfie = `data:image/jpeg;base64,${pond.uploadSelfie.toString('base64')}`;
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
   UPDATE POND - COMPLETELY FIXED
================================ */
router.put(
  "/update-pond/:farmerId/:pondId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 },
    { name: "uploadSelfie", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("📝 UPDATE POND REQUEST:", req.params, req.body);
      console.log("📸 SELFIE PRESENT:", !!req.files?.uploadSelfie?.[0]);

      const { farmerId, pondId } = req.params;
      const updateData = req.body;

      const farmer = await Farmer.getFarmerByAnyId(farmerId);
      if (!farmer) {
        return res.status(404).json({ error: "Farmer not found" });
      }

      const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
      if (pondIndex === -1) {
        return res.status(404).json({ error: "Pond not found" });
      }

      // ✅ Date parsing for safety
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

      // ✅ CHECK FOR SELFIE CHANGE
      if (req.files?.uploadSelfie?.[0]) {
        changes['pond.uploadSelfie'] = {
          old: "Previous selfie",
          new: "New selfie uploaded"
        };
      }

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

        ...updateData,

        // ✅ FIXED: Safe number parsing for latitude/longitude on update
        latitude: updateData.latitude ? parseFloat(updateData.latitude) : oldPond.latitude,
        longitude: updateData.longitude ? parseFloat(updateData.longitude) : oldPond.longitude,

        // ✅ FIXED: SIRF YAHI LINE SE SELFIE UPDATE HOGA
        ...(req.files?.uploadSelfie?.[0] && {
          uploadSelfie: req.files.uploadSelfie[0].buffer
        }),

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

      farmer.ponds[pondIndex] = updatedPond;

      await farmer.save();
      console.log("✅ Pond updated successfully. Selfie updated:", !!updatedPond.uploadSelfie);

      // Convert buffers to base64 for response
      const responseFarmer = farmer.toObject();
      
      if (responseFarmer.photo) {
        responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
      }

      if (responseFarmer.ponds && responseFarmer.ponds.length > 0) {
        responseFarmer.ponds = responseFarmer.ponds.map(pond => {
          if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
            pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
          }
          // ✅ CONVERT SELFIE TO BASE64 IF EXISTS
          if (pond.uploadSelfie && Buffer.isBuffer(pond.uploadSelfie)) {
            pond.uploadSelfie = `data:image/jpeg;base64,${pond.uploadSelfie.toString('base64')}`;
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

// Export other routes (unchanged)
router.get("/all", getFarmers);
router.get("/by-agent", getFarmersByAgent);
router.get("/:id", getFarmerById);
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

export default router;











//selfie add karne vala code hai sahi hai 


























// import express from "express";
// import upload from "../middlewares/uploads.js";
// import Farmer from "../models/farmerModel.js";
// import Counter from "../models/counterModel.js";
// import {
//   addFarmer,
//   getFarmers,
//   updateFarmer,
//   getFarmersByAgent,
//   getFarmerById
// } from "../controllers/farmerController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";  // ✅ STEP 1 — ADD THIS IMPORT

// const router = express.Router();

// /* ===============================
//    ADD POND - FIXED (SELFIE OPTIONAL)
// ================================ */
// router.post(
//   "/add-pond/:farmerId",
//   upload.fields([
//     { name: "pondImage", maxCount: 1 },
//     { name: "pondFiles", maxCount: 20 },
//     { name: "fishFiles", maxCount: 20 },
//     { name: "uploadSelfie", maxCount: 1 }
//   ]),
//   async (req, res) => {
//     try {
//       console.log("📝 ADD POND REQUEST:", req.params);
//       console.log("📸 FILES RECEIVED:", Object.keys(req.files || {}));
//       console.log("📸 SELFIE PRESENT:", !!req.files?.uploadSelfie?.[0]);
      
//       // 💥 EXTRA SAFETY - Log all incoming body data
//       console.log("🧪 BODY DATA:", req.body);

//       const { farmerId } = req.params;
//       const pondData = req.body;

//       const farmer = await Farmer.getFarmerByAnyId(farmerId);
//       if (!farmer) {
//         console.log("❌ Farmer not found:", farmerId);
//         return res.status(404).json({ error: "Farmer not found" });
//       }

//       console.log("✅ Farmer found:", farmer.farmerId);

//       // ✅ REMOVED SELFIE VALIDATION - NOT REQUIRED
//       // if (!req.files?.uploadSelfie?.[0]) {
//       //   return res.status(400).json({ error: "Selfie image is required" });
//       // }

//       // ✅ Location and other required fields
//       const requiredPondFields = [
//         'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
//         'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
//         'farmObservedDate', 'farmObservedTime',
//         'latitude', 'longitude'
//       ];
      
//       const missingFields = [];
      
//       // ✅ ✅ FINAL FIX - Safe Validation Version (No undefined.toString() error)
//       for (const field of requiredPondFields) {
//         if (
//           pondData[field] === undefined ||
//           pondData[field] === null ||
//           String(pondData[field]).trim() === ""
//         ) {
//           missingFields.push(field);
//         }
//       }
      
//       if (missingFields.length > 0) {
//         return res.status(400).json({ 
//           error: `Missing required pond fields: ${missingFields.join(', ')}` 
//         });
//       }

//       // Validate pond image
//       if (!req.files?.pondImage?.[0]) {
//         return res.status(400).json({ error: "Pond image is required" });
//       }

//       const pondNumber = getNextPondNumber(farmer);
//       const pondId = `${farmer.farmerId}-P${pondNumber}`;

//       console.log("🔢 Generated Pond ID:", pondId, "Pond Number:", pondNumber);
//       console.log("📍 Location captured:", { 
//         latitude: pondData.latitude, 
//         longitude: pondData.longitude 
//       });

//       // ✅ Date parsing for safety
//       if (pondData.dateOfStocking) {
//         pondData.dateOfStocking = new Date(pondData.dateOfStocking);
//       }
//       if (pondData.farmObservedDate) {
//         pondData.farmObservedDate = new Date(pondData.farmObservedDate);
//       }

//       // ✅ FIXED: Create new pond with conditional selfie and safe number parsing
//       const newPond = {
//         pondId,
//         pondNumber,
        
//         // Pond Details
//         pondArea: pondData.pondArea || "",
//         pondAreaUnit: pondData.pondAreaUnit || "acre",
//         pondDepth: pondData.pondDepth || "",
//         pondImage: req.files?.pondImage?.[0]?.buffer || Buffer.from([]),
        
//         // ✅ FIXED - Using parseFloat for safe number conversion
//         latitude: parseFloat(pondData.latitude),
//         longitude: parseFloat(pondData.longitude),
        
//         // ✅ FIXED: Only set uploadSelfie if file was provided
//         ...(req.files?.uploadSelfie?.[0] && {
//           uploadSelfie: req.files.uploadSelfie[0].buffer
//         }),
        
//         overflow: pondData.overflow || "No",
//         receivesSunlight: pondData.receivesSunlight || "Yes",
//         treesOnBanks: pondData.treesOnBanks || "No",
//         neighbourhood: pondData.neighbourhood || "Agriculture Farm",
//         wastewaterEnters: pondData.wastewaterEnters || "No",
        
//         // Species & Stocking
//         species: pondData.species || "",
//         dateOfStocking: pondData.dateOfStocking || new Date(),
//         qtySeedInitially: pondData.qtySeedInitially || "",
//         currentQty: pondData.currentQty || "",
//         avgSize: pondData.avgSize || ">200gram",
        
//         // Feed Details
//         feedType: pondData.feedType || "Market Feed",
//         feedOther: pondData.feedOther || "",
//         feedFreq: pondData.feedFreq || "Once a day",
//         feedQtyPerDay: pondData.feedQtyPerDay || "",
//         feedTime: pondData.feedTime || "6:00 am-10:00am",
//         recentFeedChanges: pondData.recentFeedChanges || "",
//         reducedAppetite: pondData.reducedAppetite || "No",
        
//         // Water Quality
//         waterTemperature: pondData.waterTemperature || "",
//         pH: pondData.pH || "",
//         DO: pondData.DO || "",
//         ammoniaLevel: pondData.ammoniaLevel || "Medium",
//         phytoplanktonLevel: pondData.phytoplanktonLevel || "Medium",
//         waterHardness: pondData.waterHardness || "1",
//         algaeBloom: pondData.algaeBloom || "No",
//         pondWaterColor: pondData.pondWaterColor || "Light Green",
//         sourceOfWater: pondData.sourceOfWater || "Rainwater",
        
//         // Disease & Symptoms
//         diseaseSymptoms: pondData.diseaseSymptoms || "No",
//         symptomsObserved: pondData.symptomsObserved || "",
//         fishDeaths: pondData.fishDeaths || "",
//         symptomsAffect: pondData.symptomsAffect || "All",
        
//         // Observation
//         farmObservedDate: pondData.farmObservedDate || new Date(),
//         farmObservedTime: pondData.farmObservedTime || "",
        
//         // History & Environment
//         lastSpecies: pondData.lastSpecies || "",
//         lastHarvestComplete: pondData.lastHarvestComplete || "Yes",
//         recentRainFlood: pondData.recentRainFlood || "No",
//         pesticideRunoff: pondData.pesticideRunoff || "No",
//         constructionNear: pondData.constructionNear || "No",
//         suddenTempChange: pondData.suddenTempChange || "No",
        
//         // Notes
//         notes: pondData.notes || "",
        
//         // Files
//         pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
//         fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
        
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       console.log("📋 New Pond Data:", {
//         pondId: newPond.pondId,
//         latitude: newPond.latitude,
//         longitude: newPond.longitude,
//         hasSelfie: !!newPond.uploadSelfie
//       });

//       farmer.ponds.push(newPond);
//       farmer.pondCount = farmer.ponds.length;

//       await farmer.save();
//       console.log("✅ Pond saved successfully. Selfie included:", !!newPond.uploadSelfie);

//       // Convert buffers to base64 for response
//       const responseFarmer = farmer.toObject();
//       if (responseFarmer.photo) {
//         responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
//       }

//       // Convert pond images to base64
//       if (responseFarmer.ponds && responseFarmer.ponds.length > 0) {
//         responseFarmer.ponds = responseFarmer.ponds.map(pond => {
//           if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
//             pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
//           }
//           // ✅ CONVERT SELFIE TO BASE64 IF EXISTS
//           if (pond.uploadSelfie && Buffer.isBuffer(pond.uploadSelfie)) {
//             pond.uploadSelfie = `data:image/jpeg;base64,${pond.uploadSelfie.toString('base64')}`;
//           }
//           return pond;
//         });
//       }

//       res.json({ 
//         success: true, 
//         message: "Pond added successfully",
//         farmer: responseFarmer 
//       });

//     } catch (err) {
//       console.error("🔥 ADD POND ERROR:", err);
//       res.status(500).json({ 
//         error: err.message,
//         details: err.stack 
//       });
//     }
//   }
// );

// /* ===============================
//    UPDATE POND - COMPLETELY FIXED
// ================================ */
// router.put(
//   "/update-pond/:farmerId/:pondId",
//   upload.fields([
//     { name: "pondImage", maxCount: 1 },
//     { name: "pondFiles", maxCount: 20 },
//     { name: "fishFiles", maxCount: 20 },
//     { name: "uploadSelfie", maxCount: 1 }
//   ]),
//   async (req, res) => {
//     try {
//       console.log("📝 UPDATE POND REQUEST:", req.params, req.body);
//       console.log("📸 SELFIE PRESENT:", !!req.files?.uploadSelfie?.[0]);

//       const { farmerId, pondId } = req.params;
//       const updateData = req.body;

//       const farmer = await Farmer.getFarmerByAnyId(farmerId);
//       if (!farmer) {
//         return res.status(404).json({ error: "Farmer not found" });
//       }

//       const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
//       if (pondIndex === -1) {
//         return res.status(404).json({ error: "Pond not found" });
//       }

//       // ✅ Date parsing for safety
//       if (updateData.dateOfStocking) {
//         updateData.dateOfStocking = new Date(updateData.dateOfStocking);
//       }
//       if (updateData.farmObservedDate) {
//         updateData.farmObservedDate = new Date(updateData.farmObservedDate);
//       }

//       /* ===============================
//          🔥 SAVE POND HISTORY
//       ================================ */
//       const oldPond = JSON.parse(JSON.stringify(farmer.ponds[pondIndex]));
//       const changes = {};

//       Object.keys(updateData).forEach(key => {
//         if (oldPond[key] != updateData[key]) {
//           changes[`pond.${key}`] = {
//             old: oldPond[key] || "N/A",
//             new: updateData[key]
//           };
//         }
//       });

//       // ✅ CHECK FOR SELFIE CHANGE
//       if (req.files?.uploadSelfie?.[0]) {
//         changes['pond.uploadSelfie'] = {
//           old: "Previous selfie",
//           new: "New selfie uploaded"
//         };
//       }

//       if (Object.keys(changes).length > 0) {
//         farmer.updates.push({
//           snapshot: {
//             pondId: oldPond.pondId,
//             pondNumber: oldPond.pondNumber,
//             ...oldPond
//           },
//           changes,
//           pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
//           fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
//           updatedBy: updateData.userId || farmer.userId,
//           createdAt: new Date()
//         });
//       }

//       /* ===============================
//          UPDATE POND (ID SAFE)
//       ================================ */
//       const updatedPond = {
//         ...oldPond,

//         // 🔒 pondId & pondNumber NEVER CHANGE
//         pondId: oldPond.pondId,
//         pondNumber: oldPond.pondNumber,

//         ...updateData,

//         // ✅ FIXED: Safe number parsing for latitude/longitude on update
//         latitude: updateData.latitude ? parseFloat(updateData.latitude) : oldPond.latitude,
//         longitude: updateData.longitude ? parseFloat(updateData.longitude) : oldPond.longitude,

//         // ✅ FIXED: SIRF YAHI LINE SE SELFIE UPDATE HOGA
//         ...(req.files?.uploadSelfie?.[0] && {
//           uploadSelfie: req.files.uploadSelfie[0].buffer
//         }),

//         // Handle file updates
//         pondImage: req.files?.pondImage?.[0]?.buffer || oldPond.pondImage,

//         pondFiles: req.files?.pondFiles
//           ? [
//               ...(oldPond.pondFiles || []),
//               ...req.files.pondFiles.map(f => f.buffer)
//             ]
//           : oldPond.pondFiles,

//         fishFiles: req.files?.fishFiles
//           ? [
//               ...(oldPond.fishFiles || []),
//               ...req.files.fishFiles.map(f => f.buffer)
//             ]
//           : oldPond.fishFiles,

//         updatedAt: new Date()
//       };

//       farmer.ponds[pondIndex] = updatedPond;

//       await farmer.save();
//       console.log("✅ Pond updated successfully. Selfie updated:", !!updatedPond.uploadSelfie);

//       // Convert buffers to base64 for response
//       const responseFarmer = farmer.toObject();
      
//       if (responseFarmer.photo) {
//         responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
//       }

//       if (responseFarmer.ponds && responseFarmer.ponds.length > 0) {
//         responseFarmer.ponds = responseFarmer.ponds.map(pond => {
//           if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
//             pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
//           }
//           // ✅ CONVERT SELFIE TO BASE64 IF EXISTS
//           if (pond.uploadSelfie && Buffer.isBuffer(pond.uploadSelfie)) {
//             pond.uploadSelfie = `data:image/jpeg;base64,${pond.uploadSelfie.toString('base64')}`;
//           }
//           return pond;
//         });
//       }

//       res.json({ 
//         success: true, 
//         message: "Pond updated successfully",
//         farmer: responseFarmer 
//       });

//     } catch (err) {
//       console.error("🔥 UPDATE POND ERROR:", err);
//       res.status(500).json({ 
//         error: err.message,
//         details: err.stack 
//       });
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

// /* ===============================
//    ✅ SECURED ROUTES - WITH AUTH MIDDLEWARE
// ================================ */
// router.get("/all", authMiddleware, getFarmers);              // ✅ STEP 2 — AUTH ADDED
// router.get("/by-agent", authMiddleware, getFarmersByAgent);  // ✅ AUTH ADDED
// router.get("/:id", authMiddleware, getFarmerById);           // ✅ AUTH ADDED

// /* ===============================
//    OTHER ROUTES (unchanged)
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

// export default router;