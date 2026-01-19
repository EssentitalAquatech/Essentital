




// import Farmer from "../models/farmerModel.js";
// import AccessRequest from "../models/accessRequestModel.js";

// // ----------------------------------------------------
// // 1️⃣ GET FARMERS BY AGENT (With Access Control)
// // ----------------------------------------------------
// export const getFarmersByAgent = async (req, res) => {
//   try {
//     const { agentId, viewerId } = req.query;

//     const allFarmers = await Farmer.find({ createdBy: agentId })
//       .select("name contact village _id")
//       .sort({ name: 1 });

//     const farmersWithAccess = await Promise.all(
//       allFarmers.map(async (farmer) => {
//         const access = await AccessRequest.findOne({
//           requesterId: viewerId,
//           targetFarmerId: farmer._id,
//           status: "approved",
//         });

//         if (access) {
//           const fullFarmer = await Farmer.findById(farmer._id);
//           return { ...fullFarmer.toObject(), accessApproved: true };
//         }

//         return {
//           _id: farmer._id,
//           name: farmer.name,
//           contact: farmer.contact,
//           village: farmer.village,
//           accessApproved: false,
//         };
//       })
//     );

//     res.json({
//       approved: farmersWithAccess.some(f => f.accessApproved),
//       farmers: farmersWithAccess
//     });

//   } catch (err) {
//     console.error("🔥 GET FARMERS BY AGENT ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 2️⃣ ADD FARMER (FINAL – NO DUPLICATE ERROR)
// // ----------------------------------------------------
// export const addFarmer = async (req, res) => {
//   try {
//     console.log("🔥 ADD FARMER BODY:", req.body);

//     const {
//       name, contact, age, gender, village, pondCount,
//       adhar, familyMembers, familyOccupation,
//       userId
//     } = req.body;

//     // -----------------------------
//     // FILES
//     // -----------------------------

// const photo = req.files?.photo?.[0]
//   ? `uploads/${req.files.photo[0].filename}`
//   : "";


//     // const photo = req.files?.photo?.[0]?.filename || "";
//     const pondImage = req.files?.pondImage?.[0]?.filename || "";
//     const pondFiles = req.files?.pondFiles?.map(f => f.filename) || [];
//     const fishFiles = req.files?.fishFiles?.map(f => f.filename) || [];

//     // -----------------------------
//     // ✅ FIX 1: SAFE POND COUNT
//     // -----------------------------
//     const totalPonds = parseInt(pondCount || 0);
//     let pondsArray = [];

//     if (totalPonds > 0) {
//       for (let i = 1; i <= totalPonds; i++) {
//         const tempPondId = `TEMP-${Date.now()}-${i}-${Math.random()
//           .toString(36)
//           .substring(2, 7)}`;

//         pondsArray.push({
//           pondId: tempPondId, // ✅ never null
//           pondNumber: i,
//           pondArea: req.body[`pondArea${i}`] || "",
//           pondDepth: req.body[`pondDepth${i}`] || "",
//           overflow: req.body[`overflow${i}`] || "",
//           receivesSunlight: req.body[`receivesSunlight${i}`] || "",
//           treesOnBanks: req.body[`treesOnBanks${i}`] || "",
//           neighbourhood: req.body[`neighbourhood${i}`] || "",
//           wastewaterEnters: req.body[`wastewaterEnters${i}`] || ""
//         });
//       }
//     }

//     // -----------------------------
//     // 2️⃣ CREATE FARMER
//     // -----------------------------
//     const newFarmer = new Farmer({
//       userId,
//       createdBy: userId,
//       name,
//       contact,
//       age,
//       gender,
//       village,
//       pondCount: totalPonds,
//       adhar,
//       familyMembers,
//       familyOccupation,
//       photo,
//       pondImage,
//       pondFiles,
//       fishFiles,
//       ...(pondsArray.length > 0 && { ponds: pondsArray })
//     });

//     await newFarmer.save(); // ✅ FIRST SAVE

//     // -----------------------------
//     // 3️⃣ FINAL POND IDS
//     // -----------------------------
//     if (newFarmer.ponds && newFarmer.ponds.length > 0) {
//       newFarmer.ponds = newFarmer.ponds.map((p, i) => ({
//         ...p._doc,
//         pondId: `POND-${newFarmer.farmerId}-${String(i + 1).padStart(3, "0")}`
//       }));

//       await newFarmer.save(); // ✅ SECOND SAVE
//     }

//     res.status(201).json(newFarmer);

//   } catch (err) {
//     console.error("🔥 ADD FARMER ERROR:", err);
//     res.status(500).json({
//       error: err.message,
//       details: "If error persists, drop ponds.pondId index from MongoDB"
//     });
//   }
// };

// // ----------------------------------------------------
// // 3️⃣ GET FARMERS (Own + Approved Shared)
// // ----------------------------------------------------
// export const getFarmers = async (req, res) => {
//   try {
//     const includeShared = req.query.includeShared === "true";
//     const userId = req.query.userId;

//     let farmers;

//     if (includeShared) {
//       const approvedRequests = await AccessRequest.find({
//         requesterId: userId,
//         status: "approved"
//       });

//       const ids = approvedRequests.map(r => r.targetFarmerId);
//       farmers = await Farmer.find({ _id: { $in: ids } });

//     } else {
//       farmers = await Farmer.find({ createdBy: userId });
//     }

//     res.status(200).json(farmers);

//   } catch (err) {
//     console.error("🔥 GET FARMERS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 4️⃣ GET SINGLE FARMER
// // ----------------------------------------------------
// export const getFarmerById = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) return res.status(404).json({ error: "Farmer not found" });
//     res.json(farmer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 5️⃣ DELETE FARMER
// // ----------------------------------------------------
// export const deleteFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findByIdAndDelete(req.params.id);
//     if (!farmer) return res.status(404).json({ error: "Farmer not found" });
//     res.json({ message: "Farmer deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// export const updateFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // 🔒 SAFE BODY UPDATE
//     Object.keys(req.body).forEach(key => {
//       if (
//         !["userId", "ponds", "farmerId", "photo"].includes(key) &&
//         req.body[key] !== ""
//       ) {
//         farmer[key] = req.body[key];
//       }
//     });

//     // 🔒 SAFE PHOTO UPDATE
//     if (req.files?.photo?.[0]) {
//       farmer.photo = `uploads/${req.files.photo[0].filename}`;
//     }

//     // Other files
//     if (req.files?.pondImage)
//       farmer.pondImage = req.files.pondImage[0].filename;

//     if (req.files?.pondFiles)
//       farmer.pondFiles.push(...req.files.pondFiles.map(f => f.filename));

//     if (req.files?.fishFiles)
//       farmer.fishFiles.push(...req.files.fishFiles.map(f => f.filename));

//     await farmer.save();
//     res.status(200).json(farmer);

//   } catch (err) {
//     console.error("🔥 UPDATE FARMER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };





















// import Farmer from "../models/farmerModel.js";
// import AccessRequest from "../models/accessRequestModel.js";

// // ----------------------------------------------------
// // ✅ VALIDATION FUNCTIONS
// // ----------------------------------------------------

// // Farmer data validation
// const validateFarmerData = (data) => {
//   const errors = [];
  
//   if (!data.name || data.name.trim() === "") errors.push("Name is required");
//   if (!data.contact || data.contact.trim() === "") errors.push("Contact number is required");
//   if (!data.age || data.age.trim() === "") errors.push("Age is required");
//   if (!data.gender || data.gender.trim() === "") errors.push("Gender is required");
//   if (!data.adhar || data.adhar.trim() === "") errors.push("Aadhar number is required");
//   if (!data.familyMembers || data.familyMembers.trim() === "") errors.push("Family members count is required");
//   if (!data.familyOccupation || data.familyOccupation.trim() === "") errors.push("Family occupation is required");
//   if (!data.village || data.village.trim() === "") errors.push("Village is required");
//   if (!data.pondCount || data.pondCount.trim() === "") errors.push("Pond count is required");
  
//   // Validate phone number format
//   if (data.contact && !/^\d{10}$/.test(data.contact.trim())) {
//     errors.push("Contact number must be 10 digits");
//   }
  
//   // Validate Aadhar format
//   if (data.adhar && !/^\d{12}$/.test(data.adhar.trim())) {
//     errors.push("Aadhar number must be 12 digits");
//   }
  
//   return errors;
// };

// // Pond data validation
// const validatePondData = (data) => {
//   const errors = [];
  
//   // Pond Details
//   if (!data.pondArea || data.pondArea.trim() === "") errors.push("Pond area is required");
//   if (!data.pondDepth || data.pondDepth.trim() === "") errors.push("Pond depth is required");
//   if (!data.overflow || data.overflow.trim() === "") errors.push("Overflow information is required");
//   if (!data.receivesSunlight || data.receivesSunlight.trim() === "") errors.push("Sunlight information is required");
//   if (!data.treesOnBanks || data.treesOnBanks.trim() === "") errors.push("Trees on banks information is required");
//   if (!data.neighbourhood || data.neighbourhood.trim() === "") errors.push("Neighbourhood is required");
//   if (!data.wastewaterEnters || data.wastewaterEnters.trim() === "") errors.push("Wastewater information is required");
  
//   // Species & Stocking
//   if (!data.species || data.species.trim() === "") errors.push("Fish species is required");
//   if (!data.dateOfStocking || data.dateOfStocking.trim() === "") errors.push("Date of stocking is required");
//   if (!data.qtySeedInitially || data.qtySeedInitially.trim() === "") errors.push("Initial seed quantity is required");
//   if (!data.currentQty || data.currentQty.trim() === "") errors.push("Current quantity is required");
//   if (!data.avgSize || data.avgSize.trim() === "") errors.push("Average fish size is required");
  
//   // Feed Details
//   if (!data.feedType || data.feedType.trim() === "") errors.push("Feed type is required");
//   if (!data.feedFreq || data.feedFreq.trim() === "") errors.push("Feed frequency is required");
//   if (!data.feedQtyPerDay || data.feedQtyPerDay.trim() === "") errors.push("Feed quantity per day is required");
//   if (!data.feedTime || data.feedTime.trim() === "") errors.push("Feed time is required");
//   if (!data.reducedAppetite || data.reducedAppetite.trim() === "") errors.push("Appetite information is required");
  
//   // Water Quality
//   if (!data.waterTemperature || data.waterTemperature.trim() === "") errors.push("Water temperature is required");
//   if (!data.pH || data.pH.trim() === "") errors.push("pH level is required");
//   if (!data.DO || data.DO.trim() === "") errors.push("Dissolved Oxygen (DO) is required");
//   if (!data.ammoniaLevel || data.ammoniaLevel.trim() === "") errors.push("Ammonia level is required");
//   if (!data.phytoplanktonLevel || data.phytoplanktonLevel.trim() === "") errors.push("Phytoplankton level is required");
//   if (!data.waterHardness || data.waterHardness.trim() === "") errors.push("Water hardness is required");
//   if (!data.algaeBloom || data.algaeBloom.trim() === "") errors.push("Algae bloom information is required");
//   if (!data.pondWaterColor || data.pondWaterColor.trim() === "") errors.push("Pond water color is required");
//   if (!data.sourceOfWater || data.sourceOfWater.trim() === "") errors.push("Source of water is required");
  
//   // Disease & Symptoms
//   if (!data.diseaseSymptoms || data.diseaseSymptoms.trim() === "") errors.push("Disease symptoms information is required");
//   if (data.diseaseSymptoms === "Yes" && (!data.symptomsObserved || data.symptomsObserved.trim() === "")) {
//     errors.push("Symptoms details are required when disease symptoms are present");
//   }
//   if (!data.symptomsAffect || data.symptomsAffect.trim() === "") errors.push("Symptoms affect information is required");
//   if (!data.fishDeaths || data.fishDeaths.trim() === "") errors.push("Fish deaths count is required");
  
//   // Observation & Misc
//   if (!data.farmObservedDate || data.farmObservedDate.trim() === "") errors.push("Farm observation date is required");
//   if (!data.farmObservedTime || data.farmObservedTime.trim() === "") errors.push("Farm observation time is required");
//   if (!data.lastSpecies || data.lastSpecies.trim() === "") errors.push("Last species cultured is required");
//   if (!data.lastHarvestComplete || data.lastHarvestComplete.trim() === "") errors.push("Last harvest information is required");
//   if (!data.recentRainFlood || data.recentRainFlood.trim() === "") errors.push("Recent rain/flood information is required");
//   if (!data.pesticideRunoff || data.pesticideRunoff.trim() === "") errors.push("Pesticide runoff information is required");
//   if (!data.constructionNear || data.constructionNear.trim() === "") errors.push("Construction near pond information is required");
//   if (!data.suddenTempChange || data.suddenTempChange.trim() === "") errors.push("Sudden temperature change information is required");
  
//   return errors;
// };

// // ----------------------------------------------------
// // 1️⃣ GET FARMERS BY AGENT (With Access Control)
// // ----------------------------------------------------
// export const getFarmersByAgent = async (req, res) => {
//   try {
//     const { agentId, viewerId } = req.query;

//     const allFarmers = await Farmer.find({ createdBy: agentId })
//       .select("name contact village _id")
//       .sort({ name: 1 });

//     const farmersWithAccess = await Promise.all(
//       allFarmers.map(async (farmer) => {
//         const access = await AccessRequest.findOne({
//           requesterId: viewerId,
//           targetFarmerId: farmer._id,
//           status: "approved",
//         });

//         if (access) {
//           const fullFarmer = await Farmer.findById(farmer._id);
//           return { ...fullFarmer.toObject(), accessApproved: true };
//         }

//         return {
//           _id: farmer._id,
//           name: farmer.name,
//           contact: farmer.contact,
//           village: farmer.village,
//           accessApproved: false,
//         };
//       })
//     );

//     res.json({
//       approved: farmersWithAccess.some(f => f.accessApproved),
//       farmers: farmersWithAccess
//     });

//   } catch (err) {
//     console.error("🔥 GET FARMERS BY AGENT ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 2️⃣ ADD FARMER (WITH VALIDATION)
// // ----------------------------------------------------
// export const addFarmer = async (req, res) => {
//   try {
//     console.log("🔥 ADD FARMER BODY:", req.body);

//     const {
//       name, contact, age, gender, village, pondCount,
//       adhar, familyMembers, familyOccupation,
//       userId
//     } = req.body;

//     // ✅ SERVER-SIDE VALIDATION
//     const validationErrors = validateFarmerData(req.body);
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Validation failed",
//         details: validationErrors
//       });
//     }

//     // ✅ PHOTO VALIDATION (Required for new farmer)
//     if (!req.files?.photo?.[0]) {
//       return res.status(400).json({
//         success: false,
//         error: "Validation failed",
//         details: ["Farmer photo is required"]
//       });
//     }

//     // -----------------------------
//     // FILES HANDLING
//     // -----------------------------
//     const photo = req.files?.photo?.[0]
//       ? `uploads/${req.files.photo[0].filename}`
//       : "";

//     const pondImage = req.files?.pondImage?.[0]?.filename || "";
//     const pondFiles = req.files?.pondFiles?.map(f => f.filename) || [];
//     const fishFiles = req.files?.fishFiles?.map(f => f.filename) || [];

//     // -----------------------------
//     // ✅ SAFE POND COUNT PROCESSING
//     // -----------------------------
//     const totalPonds = parseInt(pondCount || 0);
//     let pondsArray = [];

//     if (totalPonds > 0) {
//       for (let i = 1; i <= totalPonds; i++) {
//         const tempPondId = `TEMP-${Date.now()}-${i}-${Math.random()
//           .toString(36)
//           .substring(2, 7)}`;

//         pondsArray.push({
//           pondId: tempPondId,
//           pondNumber: i,
//           pondArea: req.body[`pondArea${i}`] || "",
//           pondDepth: req.body[`pondDepth${i}`] || "",
//           overflow: req.body[`overflow${i}`] || "",
//           receivesSunlight: req.body[`receivesSunlight${i}`] || "",
//           treesOnBanks: req.body[`treesOnBanks${i}`] || "",
//           neighbourhood: req.body[`neighbourhood${i}`] || "",
//           wastewaterEnters: req.body[`wastewaterEnters${i}`] || ""
//         });
//       }
//     }

//     // -----------------------------
//     // ✅ CREATE FARMER
//     // -----------------------------
//     const newFarmer = new Farmer({
//       userId,
//       createdBy: userId,
//       name,
//       contact,
//       age,
//       gender,
//       village,
//       pondCount: totalPonds,
//       adhar,
//       familyMembers,
//       familyOccupation,
//       photo,
//       pondImage,
//       pondFiles,
//       fishFiles,
//       ...(pondsArray.length > 0 && { ponds: pondsArray })
//     });

//     await newFarmer.save();

//     // -----------------------------
//     // ✅ FINAL POND IDS GENERATION
//     // -----------------------------
//     if (newFarmer.ponds && newFarmer.ponds.length > 0) {
//       newFarmer.ponds = newFarmer.ponds.map((p, i) => ({
//         ...p._doc,
//         pondId: `POND-${newFarmer.farmerId}-${String(i + 1).padStart(3, "0")}`
//       }));

//       await newFarmer.save();
//     }

//     res.status(201).json({
//       success: true,
//       message: "Farmer added successfully",
//       data: newFarmer
//     });

//   } catch (err) {
//     console.error("🔥 ADD FARMER ERROR:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message,
//       details: "If error persists, drop ponds.pondId index from MongoDB"
//     });
//   }
// };

// // ----------------------------------------------------
// // 3️⃣ ADD POND TO FARMER (WITH VALIDATION)
// // ----------------------------------------------------
// export const addPondToFarmer = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // ✅ VALIDATE FARMER EXISTS
//     const farmer = await Farmer.findById(id);
//     if (!farmer) {
//       return res.status(404).json({
//         success: false,
//         error: "Farmer not found"
//       });
//     }

//     // ✅ POND DATA VALIDATION
//     const validationErrors = validatePondData(req.body);
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Validation failed",
//         details: validationErrors
//       });
//     }

//     // ✅ POND IMAGE VALIDATION (Required for new pond)
//     if (!req.files?.pondImage?.[0]) {
//       return res.status(400).json({
//         success: false,
//         error: "Validation failed",
//         details: ["Pond image is required"]
//       });
//     }

//     const {
//       pondArea, pondAreaUnit, pondDepth,
//       overflow, receivesSunlight, treesOnBanks, neighbourhood, wastewaterEnters,
//       species, dateOfStocking, qtySeedInitially, currentQty, avgSize,
//       feedType, feedOther, feedFreq, feedQtyPerDay, feedTime, recentFeedChanges, reducedAppetite,
//       waterTemperature, pH, DO, ammoniaLevel, phytoplanktonLevel, waterHardness,
//       algaeBloom, pondWaterColor, sourceOfWater,
//       diseaseSymptoms, symptomsObserved, fishDeaths, symptomsAffect,
//       farmObservedDate, farmObservedTime,
//       lastSpecies, lastHarvestComplete, recentRainFlood, pesticideRunoff,
//       constructionNear, suddenTempChange,
//       notes
//     } = req.body;

//     // Handle symptoms array
//     let symptomsArray = [];
//     if (symptomsObserved) {
//       symptomsArray = symptomsObserved.split(',').map(s => s.trim()).filter(Boolean);
//     }

//     // -----------------------------
//     // FILES HANDLING
//     // -----------------------------
//     const pondImage = req.files?.pondImage?.[0]
//       ? `uploads/${req.files.pondImage[0].filename}`
//       : "";

//     const pondFiles = req.files?.pondFiles?.map(f => `uploads/${f.filename}`) || [];
//     const fishFiles = req.files?.fishFiles?.map(f => `uploads/${f.filename}`) || [];

//     // Generate pond ID
//     const pondNumber = farmer.ponds.length + 1;
//     const pondId = `POND-${farmer.farmerId}-${String(pondNumber).padStart(3, "0")}`;

//     // Create new pond object
//     const newPond = {
//       pondId,
//       pondNumber,
//       pondArea,
//       pondAreaUnit: pondAreaUnit || "acre",
//       pondDepth,
//       pondImage,
//       overflow,
//       receivesSunlight,
//       treesOnBanks,
//       neighbourhood,
//       wastewaterEnters,
//       species,
//       dateOfStocking,
//       qtySeedInitially,
//       currentQty,
//       avgSize,
//       feedType,
//       feedOther,
//       feedFreq,
//       feedQtyPerDay,
//       feedTime,
//       recentFeedChanges,
//       reducedAppetite,
//       waterTemperature,
//       pH,
//       DO,
//       ammoniaLevel,
//       phytoplanktonLevel,
//       waterHardness,
//       algaeBloom,
//       pondWaterColor,
//       sourceOfWater,
//       diseaseSymptoms,
//       symptomsObserved,
//       symptoms: symptomsArray,
//       fishDeaths,
//       symptomsAffect,
//       farmObservedDate,
//       farmObservedTime,
//       lastSpecies,
//       lastHarvestComplete,
//       recentRainFlood,
//       pesticideRunoff,
//       constructionNear,
//       suddenTempChange,
//       notes,
//       pondFiles,
//       fishFiles,
//       updatedAt: new Date(),
//       createdAt: new Date()
//     };

//     // Add pond to farmer
//     farmer.ponds.push(newPond);
//     farmer.pondCount = farmer.ponds.length;
    
//     // Create update log
//     const updateLog = {
//       snapshot: JSON.parse(JSON.stringify(newPond)),
//       changes: { action: "Added new pond", pondId },
//       pondFiles,
//       fishFiles,
//       updatedBy: req.body.userId || farmer.userId,
//       createdAt: new Date()
//     };
    
//     farmer.updates.push(updateLog);
//     await farmer.save();

//     res.status(201).json({
//       success: true,
//       message: "Pond added successfully",
//       data: newPond,
//       farmer
//     });

//   } catch (err) {
//     console.error("🔥 ADD POND ERROR:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // ----------------------------------------------------
// // 4️⃣ UPDATE POND (WITH VALIDATION)
// // ----------------------------------------------------
// export const updatePond = async (req, res) => {
//   try {
//     const { id, pondId } = req.params;

//     // ✅ VALIDATE FARMER EXISTS
//     const farmer = await Farmer.findById(id);
//     if (!farmer) {
//       return res.status(404).json({
//         success: false,
//         error: "Farmer not found"
//       });
//     }

//     // ✅ FIND POND
//     const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
//     if (pondIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         error: "Pond not found"
//       });
//     }

//     // ✅ POND DATA VALIDATION
//     const validationErrors = validatePondData(req.body);
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Validation failed",
//         details: validationErrors
//       });
//     }

//     const oldPond = JSON.parse(JSON.stringify(farmer.ponds[pondIndex]));
//     const {
//       pondArea, pondAreaUnit, pondDepth,
//       overflow, receivesSunlight, treesOnBanks, neighbourhood, wastewaterEnters,
//       species, dateOfStocking, qtySeedInitially, currentQty, avgSize,
//       feedType, feedOther, feedFreq, feedQtyPerDay, feedTime, recentFeedChanges, reducedAppetite,
//       waterTemperature, pH, DO, ammoniaLevel, phytoplanktonLevel, waterHardness,
//       algaeBloom, pondWaterColor, sourceOfWater,
//       diseaseSymptoms, symptomsObserved, fishDeaths, symptomsAffect,
//       farmObservedDate, farmObservedTime,
//       lastSpecies, lastHarvestComplete, recentRainFlood, pesticideRunoff,
//       constructionNear, suddenTempChange,
//       notes
//     } = req.body;

//     // Handle symptoms array
//     let symptomsArray = [];
//     if (symptomsObserved) {
//       symptomsArray = symptomsObserved.split(',').map(s => s.trim()).filter(Boolean);
//     }

//     // -----------------------------
//     // FILES HANDLING
//     // -----------------------------
//     const pondImage = req.files?.pondImage?.[0]
//       ? `uploads/${req.files.pondImage[0].filename}`
//       : farmer.ponds[pondIndex].pondImage;

//     // Merge existing files with new files
//     const existingPondFiles = farmer.ponds[pondIndex].pondFiles || [];
//     const newPondFiles = req.files?.pondFiles?.map(f => `uploads/${f.filename}`) || [];
//     const pondFiles = [...existingPondFiles, ...newPondFiles];

//     const existingFishFiles = farmer.ponds[pondIndex].fishFiles || [];
//     const newFishFiles = req.files?.fishFiles?.map(f => `uploads/${f.filename}`) || [];
//     const fishFiles = [...existingFishFiles, ...newFishFiles];

//     // Update pond
//     farmer.ponds[pondIndex] = {
//       ...farmer.ponds[pondIndex],
//       pondArea,
//       pondAreaUnit: pondAreaUnit || "acre",
//       pondDepth,
//       pondImage,
//       overflow,
//       receivesSunlight,
//       treesOnBanks,
//       neighbourhood,
//       wastewaterEnters,
//       species,
//       dateOfStocking,
//       qtySeedInitially,
//       currentQty,
//       avgSize,
//       feedType,
//       feedOther,
//       feedFreq,
//       feedQtyPerDay,
//       feedTime,
//       recentFeedChanges,
//       reducedAppetite,
//       waterTemperature,
//       pH,
//       DO,
//       ammoniaLevel,
//       phytoplanktonLevel,
//       waterHardness,
//       algaeBloom,
//       pondWaterColor,
//       sourceOfWater,
//       diseaseSymptoms,
//       symptomsObserved,
//       symptoms: symptomsArray,
//       fishDeaths,
//       symptomsAffect,
//       farmObservedDate,
//       farmObservedTime,
//       lastSpecies,
//       lastHarvestComplete,
//       recentRainFlood,
//       pesticideRunoff,
//       constructionNear,
//       suddenTempChange,
//       notes,
//       pondFiles,
//       fishFiles,
//       updatedAt: new Date()
//     };

//     // Create update log with changes
//     const changes = {};
//     Object.keys(farmer.ponds[pondIndex]).forEach(key => {
//       if (key !== '_id' && key !== 'pondId' && key !== 'pondNumber' && 
//           key !== 'updatedAt' && key !== 'createdAt' &&
//           JSON.stringify(oldPond[key]) !== JSON.stringify(farmer.ponds[pondIndex][key])) {
//         changes[key] = {
//           old: oldPond[key],
//           new: farmer.ponds[pondIndex][key]
//         };
//       }
//     });

//     const updateLog = {
//       snapshot: JSON.parse(JSON.stringify(farmer.ponds[pondIndex])),
//       changes,
//       pondFiles: newPondFiles,
//       fishFiles: newFishFiles,
//       updatedBy: req.body.userId || farmer.userId,
//       createdAt: new Date()
//     };
    
//     farmer.updates.push(updateLog);
//     await farmer.save();

//     res.status(200).json({
//       success: true,
//       message: "Pond updated successfully",
//       data: farmer.ponds[pondIndex],
//       farmer
//     });

//   } catch (err) {
//     console.error("🔥 UPDATE POND ERROR:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // ----------------------------------------------------
// // 5️⃣ UPDATE FARMER (WITH VALIDATION)
// // ----------------------------------------------------
// export const updateFarmer = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // ✅ VALIDATE FARMER EXISTS
//     const farmer = await Farmer.findById(id);
//     if (!farmer) {
//       return res.status(404).json({
//         success: false,
//         error: "Farmer not found"
//       });
//     }

//     // ✅ FARMER DATA VALIDATION
//     const validationErrors = validateFarmerData(req.body);
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Validation failed",
//         details: validationErrors
//       });
//     }

//     const oldFarmer = JSON.parse(JSON.stringify(farmer));

//     // 🔒 SAFE BODY UPDATE
//     Object.keys(req.body).forEach(key => {
//       if (
//         !["userId", "ponds", "farmerId", "photo", "createdAt", "updatedAt"].includes(key) &&
//         req.body[key] !== "" && req.body[key] !== undefined
//       ) {
//         farmer[key] = req.body[key];
//       }
//     });

//     // 🔒 SAFE PHOTO UPDATE
//     if (req.files?.photo?.[0]) {
//       farmer.photo = `uploads/${req.files.photo[0].filename}`;
//     }

//     // Other files
//     if (req.files?.pondImage?.[0]) {
//       farmer.pondImage = `uploads/${req.files.pondImage[0].filename}`;
//     }

//     if (req.files?.pondFiles) {
//       const newPondFiles = req.files.pondFiles.map(f => `uploads/${f.filename}`);
//       farmer.pondFiles = [...(farmer.pondFiles || []), ...newPondFiles];
//     }

//     if (req.files?.fishFiles) {
//       const newFishFiles = req.files.fishFiles.map(f => `uploads/${f.filename}`);
//       farmer.fishFiles = [...(farmer.fishFiles || []), ...newFishFiles];
//     }

//     // Create update log with changes
//     const changes = {};
//     Object.keys(farmer.toObject()).forEach(key => {
//       if (key !== '_id' && key !== '__v' && key !== 'farmerId' && 
//           key !== 'createdAt' && key !== 'updatedAt' && key !== 'updates' &&
//           JSON.stringify(oldFarmer[key]) !== JSON.stringify(farmer[key])) {
//         changes[key] = {
//           old: oldFarmer[key],
//           new: farmer[key]
//         };
//       }
//     });

//     const updateLog = {
//       snapshot: JSON.parse(JSON.stringify(farmer.toObject())),
//       changes,
//       pondFiles: req.files?.pondFiles?.map(f => `uploads/${f.filename}`) || [],
//       fishFiles: req.files?.fishFiles?.map(f => `uploads/${f.filename}`) || [],
//       updatedBy: req.body.userId || farmer.userId,
//       createdAt: new Date()
//     };
    
//     farmer.updates.push(updateLog);
//     await farmer.save();

//     res.status(200).json({
//       success: true,
//       message: "Farmer updated successfully",
//       data: farmer
//     });

//   } catch (err) {
//     console.error("🔥 UPDATE FARMER ERROR:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // ----------------------------------------------------
// // 6️⃣ GET ALL FARMERS (Own + Approved Shared)
// // ----------------------------------------------------
// export const getFarmers = async (req, res) => {
//   try {
//     const includeShared = req.query.includeShared === "true";
//     const userId = req.query.userId;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         error: "User ID is required"
//       });
//     }

//     let farmers;

//     if (includeShared) {
//       const approvedRequests = await AccessRequest.find({
//         requesterId: userId,
//         status: "approved"
//       });

//       const ids = approvedRequests.map(r => r.targetFarmerId);
//       farmers = await Farmer.find({ _id: { $in: ids } });

//     } else {
//       farmers = await Farmer.find({ createdBy: userId });
//     }

//     res.status(200).json({
//       success: true,
//       count: farmers.length,
//       data: farmers
//     });

//   } catch (err) {
//     console.error("🔥 GET FARMERS ERROR:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // ----------------------------------------------------
// // 7️⃣ GET SINGLE FARMER
// // ----------------------------------------------------
// export const getFarmerById = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) {
//       return res.status(404).json({
//         success: false,
//         error: "Farmer not found"
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: farmer
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // ----------------------------------------------------
// // 8️⃣ DELETE FARMER
// // ----------------------------------------------------
// export const deleteFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findByIdAndDelete(req.params.id);
//     if (!farmer) {
//       return res.status(404).json({
//         success: false,
//         error: "Farmer not found"
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "Farmer deleted successfully"
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // ----------------------------------------------------
// // 9️⃣ DELETE POND
// // ----------------------------------------------------
// export const deletePond = async (req, res) => {
//   try {
//     const { id, pondId } = req.params;

//     const farmer = await Farmer.findById(id);
//     if (!farmer) {
//       return res.status(404).json({
//         success: false,
//         error: "Farmer not found"
//       });
//     }

//     const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
//     if (pondIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         error: "Pond not found"
//       });
//     }

//     // Remove pond
//     farmer.ponds.splice(pondIndex, 1);
//     farmer.pondCount = farmer.ponds.length;

//     // Create update log
//     const updateLog = {
//       snapshot: null,
//       changes: { action: "Deleted pond", pondId },
//       updatedBy: req.body.userId || farmer.userId,
//       createdAt: new Date()
//     };
    
//     farmer.updates.push(updateLog);
//     await farmer.save();

//     res.status(200).json({
//       success: true,
//       message: "Pond deleted successfully",
//       farmer
//     });

//   } catch (err) {
//     console.error("🔥 DELETE POND ERROR:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // ----------------------------------------------------
// // 🔟 GET FARMER BY ANY ID
// // ----------------------------------------------------
// export async function getFarmerByAnyId(farmerId) {
//   if (mongoose.Types.ObjectId.isValid(farmerId)) {
//     const farmer = await Farmer.findById(farmerId);
//     if (farmer) return farmer;
//   }
//   return await Farmer.findOne({ farmerId });
// }

// // ----------------------------------------------------
// // Routes के लिए export
// // ----------------------------------------------------
// export default {
//   getFarmersByAgent,
//   addFarmer,
//   addPondToFarmer,
//   updatePond,
//   updateFarmer,
//   getFarmers,
//   getFarmerById,
//   deleteFarmer,
//   deletePond,
//   getFarmerByAnyId,
//   validateFarmerData,
//   validatePondData
// };

























import Farmer from "../models/farmerModel.js";
import AccessRequest from "../models/accessRequestModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------------
// ✅ VALIDATION FUNCTIONS - WITHOUT POND COUNT
// ----------------------------------------------------

// Farmer data validation - WITHOUT POND COUNT
const validateFarmerData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === "") errors.push("Name is required");
  if (!data.contact || data.contact.trim() === "") errors.push("Contact number is required");
  if (!data.age || data.age.trim() === "") errors.push("Age is required");
  if (!data.gender || data.gender.trim() === "") errors.push("Gender is required");
  if (!data.adhar || data.adhar.trim() === "") errors.push("Aadhar number is required");
  if (!data.familyMembers || data.familyMembers.trim() === "") errors.push("Family members count is required");
  if (!data.familyOccupation || data.familyOccupation.trim() === "") errors.push("Family occupation is required");
  if (!data.village || data.village.trim() === "") errors.push("Village is required");
  
  // Validate phone number format
  if (data.contact && !/^\d{10}$/.test(data.contact.trim())) {
    errors.push("Contact number must be 10 digits");
  }
  
  // Validate Aadhar format
  if (data.adhar && !/^\d{12}$/.test(data.adhar.trim())) {
    errors.push("Aadhar number must be 12 digits");
  }
  
  return errors;
};

// Pond data validation
const validatePondData = (data) => {
  const errors = [];
  
  // Pond Details
  if (!data.pondArea || data.pondArea.trim() === "") errors.push("Pond area is required");
  if (!data.pondDepth || data.pondDepth.trim() === "") errors.push("Pond depth is required");
  if (!data.overflow || data.overflow.trim() === "") errors.push("Overflow information is required");
  if (!data.receivesSunlight || data.receivesSunlight.trim() === "") errors.push("Sunlight information is required");
  if (!data.treesOnBanks || data.treesOnBanks.trim() === "") errors.push("Trees on banks information is required");
  if (!data.neighbourhood || data.neighbourhood.trim() === "") errors.push("Neighbourhood is required");
  if (!data.wastewaterEnters || data.wastewaterEnters.trim() === "") errors.push("Wastewater information is required");
  
  // Species & Stocking
  if (!data.species || data.species.trim() === "") errors.push("Fish species is required");
  if (!data.dateOfStocking || data.dateOfStocking.trim() === "") errors.push("Date of stocking is required");
  if (!data.qtySeedInitially || data.qtySeedInitially.trim() === "") errors.push("Initial seed quantity is required");
  if (!data.currentQty || data.currentQty.trim() === "") errors.push("Current quantity is required");
  if (!data.avgSize || data.avgSize.trim() === "") errors.push("Average fish size is required");
  
  // Feed Details
  if (!data.feedType || data.feedType.trim() === "") errors.push("Feed type is required");
  if (!data.feedFreq || data.feedFreq.trim() === "") errors.push("Feed frequency is required");
  if (!data.feedQtyPerDay || data.feedQtyPerDay.trim() === "") errors.push("Feed quantity per day is required");
  if (!data.feedTime || data.feedTime.trim() === "") errors.push("Feed time is required");
  if (!data.reducedAppetite || data.reducedAppetite.trim() === "") errors.push("Appetite information is required");
  
  // Water Quality
  if (!data.waterTemperature || data.waterTemperature.trim() === "") errors.push("Water temperature is required");
  if (!data.pH || data.pH.trim() === "") errors.push("pH level is required");
  if (!data.DO || data.DO.trim() === "") errors.push("Dissolved Oxygen (DO) is required");
  if (!data.ammoniaLevel || data.ammoniaLevel.trim() === "") errors.push("Ammonia level is required");
  if (!data.phytoplanktonLevel || data.phytoplanktonLevel.trim() === "") errors.push("Phytoplankton level is required");
  if (!data.waterHardness || data.waterHardness.trim() === "") errors.push("Water hardness is required");
  if (!data.algaeBloom || data.algaeBloom.trim() === "") errors.push("Algae bloom information is required");
  if (!data.pondWaterColor || data.pondWaterColor.trim() === "") errors.push("Pond water color is required");
  if (!data.sourceOfWater || data.sourceOfWater.trim() === "") errors.push("Source of water is required");
  
  // Disease & Symptoms
  if (!data.diseaseSymptoms || data.diseaseSymptoms.trim() === "") errors.push("Disease symptoms information is required");
  if (data.diseaseSymptoms === "Yes" && (!data.symptomsObserved || data.symptomsObserved.trim() === "")) {
    errors.push("Symptoms details are required when disease symptoms are present");
  }
  if (!data.symptomsAffect || data.symptomsAffect.trim() === "") errors.push("Symptoms affect information is required");
  if (!data.fishDeaths || data.fishDeaths.trim() === "") errors.push("Fish deaths count is required");
  
  // Observation & Misc
  if (!data.farmObservedDate || data.farmObservedDate.trim() === "") errors.push("Farm observation date is required");
  if (!data.farmObservedTime || data.farmObservedTime.trim() === "") errors.push("Farm observation time is required");
  if (!data.lastSpecies || data.lastSpecies.trim() === "") errors.push("Last species cultured is required");
  if (!data.lastHarvestComplete || data.lastHarvestComplete.trim() === "") errors.push("Last harvest information is required");
  if (!data.recentRainFlood || data.recentRainFlood.trim() === "") errors.push("Recent rain/flood information is required");
  if (!data.pesticideRunoff || data.pesticideRunoff.trim() === "") errors.push("Pesticide runoff information is required");
  if (!data.constructionNear || data.constructionNear.trim() === "") errors.push("Construction near pond information is required");
  if (!data.suddenTempChange || data.suddenTempChange.trim() === "") errors.push("Sudden temperature change information is required");
  
  return errors;
};

// ----------------------------------------------------
// ✅ HELPER FUNCTION FOR SAFE FILE SAVING
// ----------------------------------------------------
const saveFileSafely = (file, folderName) => {
  if (!file) return null;
  
  try {
    // Create folder if it doesn't exist
    const uploadDir = path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate unique filename
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    // Write file
    fs.writeFileSync(filePath, file.buffer);
    
    return `uploads/${folderName}/${uniqueName}`;
  } catch (error) {
    console.error(`Error saving file to ${folderName}:`, error);
    return null;
  }
};

// ----------------------------------------------------
// 1️⃣ ADD FARMER (WITHOUT POND COUNT)
// ----------------------------------------------------
export const addFarmer = async (req, res) => {
  try {
    console.log("🔥 ADD FARMER BODY:", req.body);

    const {
      name, contact, age, gender, village,
      adhar, familyMembers, familyOccupation,
      userId
    } = req.body;

    // ✅ SERVER-SIDE VALIDATION
    const validationErrors = validateFarmerData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors
      });
    }

    // ✅ PHOTO VALIDATION (Required for new farmer)
    if (!req.files?.photo?.[0]) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: ["Farmer photo is required"]
      });
    }

    // -----------------------------
    // ✅ SAFE FILE SAVING
    // -----------------------------
    const photo = saveFileSafely(req.files.photo[0], 'farmers');
    if (!photo) {
      return res.status(500).json({
        success: false,
        error: "Failed to save farmer photo"
      });
    }

    // -----------------------------
    // ✅ CREATE FARMER WITHOUT POND COUNT
    // -----------------------------
    const newFarmer = new Farmer({
      userId,
      createdBy: userId,
      name,
      contact,
      age,
      gender,
      village,
      adhar,
      familyMembers,
      familyOccupation,
      photo,
      pondCount: 0, // Start with 0 ponds
      ponds: [] // Empty ponds array
    });

    await newFarmer.save();

    res.status(201).json({
      success: true,
      message: "Farmer added successfully",
      data: newFarmer
    });

  } catch (err) {
    console.error("🔥 ADD FARMER ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 2️⃣ ADD POND TO FARMER
// ----------------------------------------------------
export const addPondToFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ✅ VALIDATE FARMER EXISTS
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer not found"
      });
    }

    // ✅ POND DATA VALIDATION
    const validationErrors = validatePondData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors
      });
    }

    // ✅ POND IMAGE VALIDATION (Required for new pond)
    if (!req.files?.pondImage?.[0]) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: ["Pond image is required"]
      });
    }

    const {
      pondArea, pondAreaUnit, pondDepth,
      overflow, receivesSunlight, treesOnBanks, neighbourhood, wastewaterEnters,
      species, dateOfStocking, qtySeedInitially, currentQty, avgSize,
      feedType, feedOther, feedFreq, feedQtyPerDay, feedTime, recentFeedChanges, reducedAppetite,
      waterTemperature, pH, DO, ammoniaLevel, phytoplanktonLevel, waterHardness,
      algaeBloom, pondWaterColor, sourceOfWater,
      diseaseSymptoms, symptomsObserved, fishDeaths, symptomsAffect,
      farmObservedDate, farmObservedTime,
      lastSpecies, lastHarvestComplete, recentRainFlood, pesticideRunoff,
      constructionNear, suddenTempChange,
      notes
    } = req.body;

    // Handle symptoms array
    let symptomsArray = [];
    if (symptomsObserved) {
      symptomsArray = symptomsObserved.split(',').map(s => s.trim()).filter(Boolean);
    }

    // -----------------------------
    // ✅ SAFE FILE SAVING
    // -----------------------------
    const pondImage = saveFileSafely(req.files.pondImage[0], 'ponds');
    if (!pondImage) {
      return res.status(500).json({
        success: false,
        error: "Failed to save pond image"
      });
    }

    // Save other files
    const pondFiles = req.files?.pondFiles?.map(file => saveFileSafely(file, 'ponds')).filter(Boolean) || [];
    const fishFiles = req.files?.fishFiles?.map(file => saveFileSafely(file, 'fish')).filter(Boolean) || [];

    // Generate pond ID
    const pondNumber = farmer.ponds.length + 1;
    const pondId = `POND-${farmer.farmerId}-${String(pondNumber).padStart(3, "0")}`;

    // Create new pond object
    const newPond = {
      pondId,
      pondNumber,
      pondArea,
      pondAreaUnit: pondAreaUnit || "acre",
      pondDepth,
      pondImage,
      overflow,
      receivesSunlight,
      treesOnBanks,
      neighbourhood,
      wastewaterEnters,
      species,
      dateOfStocking,
      qtySeedInitially,
      currentQty,
      avgSize,
      feedType,
      feedOther,
      feedFreq,
      feedQtyPerDay,
      feedTime,
      recentFeedChanges,
      reducedAppetite,
      waterTemperature,
      pH,
      DO,
      ammoniaLevel,
      phytoplanktonLevel,
      waterHardness,
      algaeBloom,
      pondWaterColor,
      sourceOfWater,
      diseaseSymptoms,
      symptomsObserved,
      symptoms: symptomsArray,
      fishDeaths,
      symptomsAffect,
      farmObservedDate,
      farmObservedTime,
      lastSpecies,
      lastHarvestComplete,
      recentRainFlood,
      pesticideRunoff,
      constructionNear,
      suddenTempChange,
      notes,
      pondFiles,
      fishFiles,
      updatedAt: new Date(),
      createdAt: new Date()
    };

    // Add pond to farmer
    farmer.ponds.push(newPond);
    farmer.pondCount = farmer.ponds.length;
    
    // Create update log
    const updateLog = {
      snapshot: JSON.parse(JSON.stringify(newPond)),
      changes: { action: "Added new pond", pondId },
      pondFiles,
      fishFiles,
      updatedBy: req.body.userId || farmer.userId,
      createdAt: new Date()
    };
    
    farmer.updates.push(updateLog);
    await farmer.save();

    res.status(201).json({
      success: true,
      message: "Pond added successfully",
      data: newPond,
      farmer
    });

  } catch (err) {
    console.error("🔥 ADD POND ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 3️⃣ UPDATE FARMER (WITH SAFE FILE HANDLING)
// ----------------------------------------------------
export const updateFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ✅ VALIDATE FARMER EXISTS
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer not found"
      });
    }

    // ✅ FARMER DATA VALIDATION
    const validationErrors = validateFarmerData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors
      });
    }

    const oldFarmer = JSON.parse(JSON.stringify(farmer));

    // 🔒 SAFE BODY UPDATE
    Object.keys(req.body).forEach(key => {
      if (
        !["userId", "ponds", "farmerId", "photo", "createdAt", "updatedAt", "pondCount"].includes(key) &&
        req.body[key] !== "" && req.body[key] !== undefined
      ) {
        farmer[key] = req.body[key];
      }
    });

    // 🔒 SAFE PHOTO UPDATE - Only if new photo is provided
    if (req.files?.photo?.[0]) {
      const photo = saveFileSafely(req.files.photo[0], 'farmers');
      if (photo) {
        farmer.photo = photo;
      }
    }

    // Create update log with changes
    const changes = {};
    Object.keys(farmer.toObject()).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'farmerId' && 
          key !== 'createdAt' && key !== 'updatedAt' && key !== 'updates' &&
          JSON.stringify(oldFarmer[key]) !== JSON.stringify(farmer[key])) {
        changes[key] = {
          old: oldFarmer[key],
          new: farmer[key]
        };
      }
    });

    const updateLog = {
      snapshot: JSON.parse(JSON.stringify(farmer.toObject())),
      changes,
      updatedBy: req.body.userId || farmer.userId,
      createdAt: new Date()
    };
    
    farmer.updates.push(updateLog);
    await farmer.save();

    res.status(200).json({
      success: true,
      message: "Farmer updated successfully",
      data: farmer
    });

  } catch (err) {
    console.error("🔥 UPDATE FARMER ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 4️⃣ UPDATE POND (WITH SAFE FILE HANDLING)
// ----------------------------------------------------
export const updatePond = async (req, res) => {
  try {
    const { id, pondId } = req.params;

    // ✅ VALIDATE FARMER EXISTS
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer not found"
      });
    }

    // ✅ FIND POND
    const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
    if (pondIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Pond not found"
      });
    }

    // ✅ POND DATA VALIDATION
    const validationErrors = validatePondData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors
      });
    }

    const oldPond = JSON.parse(JSON.stringify(farmer.ponds[pondIndex]));
    const {
      pondArea, pondAreaUnit, pondDepth,
      overflow, receivesSunlight, treesOnBanks, neighbourhood, wastewaterEnters,
      species, dateOfStocking, qtySeedInitially, currentQty, avgSize,
      feedType, feedOther, feedFreq, feedQtyPerDay, feedTime, recentFeedChanges, reducedAppetite,
      waterTemperature, pH, DO, ammoniaLevel, phytoplanktonLevel, waterHardness,
      algaeBloom, pondWaterColor, sourceOfWater,
      diseaseSymptoms, symptomsObserved, fishDeaths, symptomsAffect,
      farmObservedDate, farmObservedTime,
      lastSpecies, lastHarvestComplete, recentRainFlood, pesticideRunoff,
      constructionNear, suddenTempChange,
      notes
    } = req.body;

    // Handle symptoms array
    let symptomsArray = [];
    if (symptomsObserved) {
      symptomsArray = symptomsObserved.split(',').map(s => s.trim()).filter(Boolean);
    }

    // -----------------------------
    // ✅ SAFE FILE SAVING
    // -----------------------------
    
    // Update pond image only if new one is provided
    if (req.files?.pondImage?.[0]) {
      const pondImage = saveFileSafely(req.files.pondImage[0], 'ponds');
      if (pondImage) {
        farmer.ponds[pondIndex].pondImage = pondImage;
      }
    }

    // Add new pond files
    const newPondFiles = req.files?.pondFiles?.map(file => saveFileSafely(file, 'ponds')).filter(Boolean) || [];
    if (newPondFiles.length > 0) {
      farmer.ponds[pondIndex].pondFiles = [...(farmer.ponds[pondIndex].pondFiles || []), ...newPondFiles];
    }

    // Add new fish files
    const newFishFiles = req.files?.fishFiles?.map(file => saveFileSafely(file, 'fish')).filter(Boolean) || [];
    if (newFishFiles.length > 0) {
      farmer.ponds[pondIndex].fishFiles = [...(farmer.ponds[pondIndex].fishFiles || []), ...newFishFiles];
    }

    // Update other pond fields
    farmer.ponds[pondIndex] = {
      ...farmer.ponds[pondIndex],
      pondArea,
      pondAreaUnit: pondAreaUnit || "acre",
      pondDepth,
      overflow,
      receivesSunlight,
      treesOnBanks,
      neighbourhood,
      wastewaterEnters,
      species,
      dateOfStocking,
      qtySeedInitially,
      currentQty,
      avgSize,
      feedType,
      feedOther,
      feedFreq,
      feedQtyPerDay,
      feedTime,
      recentFeedChanges,
      reducedAppetite,
      waterTemperature,
      pH,
      DO,
      ammoniaLevel,
      phytoplanktonLevel,
      waterHardness,
      algaeBloom,
      pondWaterColor,
      sourceOfWater,
      diseaseSymptoms,
      symptomsObserved,
      symptoms: symptomsArray,
      fishDeaths,
      symptomsAffect,
      farmObservedDate,
      farmObservedTime,
      lastSpecies,
      lastHarvestComplete,
      recentRainFlood,
      pesticideRunoff,
      constructionNear,
      suddenTempChange,
      notes,
      updatedAt: new Date()
    };

    // Create update log with changes
    const changes = {};
    Object.keys(farmer.ponds[pondIndex]).forEach(key => {
      if (key !== '_id' && key !== 'pondId' && key !== 'pondNumber' && 
          key !== 'updatedAt' && key !== 'createdAt' &&
          JSON.stringify(oldPond[key]) !== JSON.stringify(farmer.ponds[pondIndex][key])) {
        changes[key] = {
          old: oldPond[key],
          new: farmer.ponds[pondIndex][key]
        };
      }
    });

    const updateLog = {
      snapshot: JSON.parse(JSON.stringify(farmer.ponds[pondIndex])),
      changes,
      pondFiles: newPondFiles,
      fishFiles: newFishFiles,
      updatedBy: req.body.userId || farmer.userId,
      createdAt: new Date()
    };
    
    farmer.updates.push(updateLog);
    await farmer.save();

    res.status(200).json({
      success: true,
      message: "Pond updated successfully",
      data: farmer.ponds[pondIndex],
      farmer
    });

  } catch (err) {
    console.error("🔥 UPDATE POND ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 5️⃣ GET ALL FARMERS (Own + Approved Shared)
// ----------------------------------------------------
export const getFarmers = async (req, res) => {
  try {
    const includeShared = req.query.includeShared === "true";
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required"
      });
    }

    let farmers;

    if (includeShared) {
      const approvedRequests = await AccessRequest.find({
        requesterId: userId,
        status: "approved"
      });

      const ids = approvedRequests.map(r => r.targetFarmerId);
      farmers = await Farmer.find({ _id: { $in: ids } });

    } else {
      farmers = await Farmer.find({ createdBy: userId });
    }

    res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers
    });

  } catch (err) {
    console.error("🔥 GET FARMERS ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 6️⃣ GET SINGLE FARMER
// ----------------------------------------------------
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: farmer
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 7️⃣ DELETE FARMER
// ----------------------------------------------------
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer not found"
      });
    }
    
    await Farmer.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Farmer deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 8️⃣ DELETE POND
// ----------------------------------------------------
export const deletePond = async (req, res) => {
  try {
    const { id, pondId } = req.params;

    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer not found"
      });
    }

    const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
    if (pondIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Pond not found"
      });
    }

    // Remove pond
    farmer.ponds.splice(pondIndex, 1);
    farmer.pondCount = farmer.ponds.length;

    // Create update log
    const updateLog = {
      snapshot: null,
      changes: { action: "Deleted pond", pondId },
      updatedBy: req.body.userId || farmer.userId,
      createdAt: new Date()
    };
    
    farmer.updates.push(updateLog);
    await farmer.save();

    res.status(200).json({
      success: true,
      message: "Pond deleted successfully",
      farmer
    });

  } catch (err) {
    console.error("🔥 DELETE POND ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ----------------------------------------------------
// 9️⃣ GET FARMER BY ANY ID
// ----------------------------------------------------
export async function getFarmerByAnyId(farmerId) {
  if (mongoose.Types.ObjectId.isValid(farmerId)) {
    const farmer = await Farmer.findById(farmerId);
    if (farmer) return farmer;
  }
  return await Farmer.findOne({ farmerId });
}