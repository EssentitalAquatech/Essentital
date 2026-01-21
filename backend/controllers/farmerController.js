















// import Farmer from "../models/farmerModel.js";
// import AccessRequest from "../models/accessRequestModel.js";

// // ----------------------------------------------------
// // 1️⃣ GET FARMERS BY AGENT (With Access Control)
// // ----------------------------------------------------
// export const getFarmersByAgent = async (req, res) => {
//   try {
//     const { agentId, viewerId } = req.query;

//     const allFarmers = await Farmer.find({ createdBy: agentId })
//       .select("name contact village photo _id") // ✅ PHOTO FIELD ADDED
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
//           return { 
//             ...fullFarmer.toObject(), 
//             accessApproved: true,
//             photo: fullFarmer.photo
//               ? `${req.protocol}://${req.get("host")}/uploads/${fullFarmer.photo}`
//               : null // ✅ PHOTO URL FORMATTED
//           };
//         }

//         return {
//           _id: farmer._id,
//           name: farmer.name,
//           contact: farmer.contact,
//           village: farmer.village,
//           photo: farmer.photo
//             ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//             : null, // ✅ PHOTO URL FORMATTED
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
// // 2️⃣ ADD FARMER (FINAL – WITH VALIDATION)
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
//     // ✅ VALIDATION: REQUIRED FIELDS
//     // -----------------------------
//     const requiredFields = [
//       'name', 'contact', 'age', 'gender', 'village', 
//       'adhar', 'familyMembers', 'familyOccupation'
//     ];
    
//     const missingFields = [];
//     requiredFields.forEach(field => {
//       if (!req.body[field] || req.body[field].toString().trim() === '') {
//         missingFields.push(field);
//       }
//     });
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: `Required fields are missing: ${missingFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: AADHAR NUMBER
//     // -----------------------------
//     if (adhar) {
//       const adharStr = adhar.toString().trim();
//       if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
//         return res.status(400).json({
//           error: "Aadhar number must be exactly 12 digits"
//         });
//       }
//     }

//     // -----------------------------
//     // FILES
//     // -----------------------------
//     const photo = req.files?.photo?.[0]
//       ? `uploads/${req.files.photo[0].filename}`
//       : "";

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

//     // Format photo URLs for all farmers
//     const formattedFarmers = farmers.map(farmer => ({
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED FOR ALL FARMERS
//     }));

//     res.status(200).json(formattedFarmers);

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
    
//     // Format photo URL
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };
    
//     res.json(formattedFarmer);
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

// // ----------------------------------------------------
// // 6️⃣ UPDATE FARMER (WITH VALIDATION)
// // ----------------------------------------------------
// export const updateFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: REQUIRED FIELDS
//     // -----------------------------
//     const requiredFields = [
//       'name', 'contact', 'age', 'gender', 'village',
//       'adhar', 'familyMembers', 'familyOccupation'
//     ];
    
//     const missingFields = [];
//     requiredFields.forEach(field => {
//       if (req.body[field] !== undefined && 
//           (!req.body[field] || req.body[field].toString().trim() === '')) {
//         missingFields.push(field);
//       }
//     });
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: `Required fields cannot be empty: ${missingFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: AADHAR NUMBER
//     // -----------------------------
//     if (req.body.adhar) {
//       const adharStr = req.body.adhar.toString().trim();
//       if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
//         return res.status(400).json({
//           error: "Aadhar number must be exactly 12 digits"
//         });
//       }
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
    
//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };
    
//     res.status(200).json(formattedFarmer);

//   } catch (err) {
//     console.error("🔥 UPDATE FARMER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 7️⃣ ADD POND (WITH VALIDATION) - UPDATE IN ROUTES
// // ----------------------------------------------------
// export const addPondWithValidation = async (req, res) => {
//   try {
//     const { farmerId } = req.params;
//     const pondData = req.body;

//     // Find farmer
//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // -----------------------------
//     // ✅ POND REQUIRED FIELDS VALIDATION
//     // -----------------------------
//     const pondRequiredFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking',
//       'qtySeedInitially', 'currentQty', 'waterTemperature',
//       'pH', 'DO', 'sourceOfWater'
//     ];
    
//     const missingPondFields = [];
//     pondRequiredFields.forEach(field => {
//       if (!pondData[field] || pondData[field].toString().trim() === '') {
//         missingPondFields.push(field);
//       }
//     });
    
//     if (missingPondFields.length > 0) {
//       return res.status(400).json({
//         error: `Pond required fields are missing: ${missingPondFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATE NUMERIC FIELDS
//     // -----------------------------
//     if (pondData.pondArea && isNaN(parseFloat(pondData.pondArea))) {
//       return res.status(400).json({ error: "Pond area must be a number" });
//     }
    
//     if (pondData.pondDepth && isNaN(parseFloat(pondData.pondDepth))) {
//       return res.status(400).json({ error: "Pond depth must be a number" });
//     }
    
//     if (pondData.qtySeedInitially && isNaN(parseInt(pondData.qtySeedInitially))) {
//       return res.status(400).json({ error: "Initial seed quantity must be a number" });
//     }
    
//     if (pondData.currentQty && isNaN(parseInt(pondData.currentQty))) {
//       return res.status(400).json({ error: "Current quantity must be a number" });
//     }
    
//     if (pondData.waterTemperature && isNaN(parseFloat(pondData.waterTemperature))) {
//       return res.status(400).json({ error: "Water temperature must be a number" });
//     }
    
//     if (pondData.pH && isNaN(parseFloat(pondData.pH))) {
//       return res.status(400).json({ error: "pH must be a number" });
//     }
    
//     if (pondData.DO && isNaN(parseFloat(pondData.DO))) {
//       return res.status(400).json({ error: "DO must be a number" });
//     }

//     // Create pond number
//     const pondNumber = farmer.ponds.length > 0 
//       ? Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1 
//       : 1;
    
//     const pondId = `${farmer.farmerId}-P${String(pondNumber).padStart(3, '0')}`;

//     // Create new pond object
//     const newPond = {
//       pondId,
//       pondNumber,
//       ...pondData,
//       pondImage: req.files?.pondImage?.[0]?.filename || "",
//       pondFiles: req.files?.pondFiles?.map(f => f.filename) || [],
//       fishFiles: req.files?.fishFiles?.map(f => f.filename) || [],
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     // Add pond to farmer
//     farmer.ponds.push(newPond);
//     farmer.pondCount = farmer.ponds.length;

//     await farmer.save();

//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };

//     res.json({ success: true, farmer: formattedFarmer });

//   } catch (err) {
//     console.error("ADD POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 8️⃣ UPDATE POND (WITH VALIDATION) - UPDATE IN ROUTES
// // ----------------------------------------------------
// export const updatePondWithValidation = async (req, res) => {
//   try {
//     const { farmerId, pondId } = req.params;
//     const updateData = req.body;

//     // Find farmer
//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // Find pond
//     const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
//     if (pondIndex === -1) {
//       return res.status(404).json({ error: "Pond not found" });
//     }

//     const oldPond = farmer.ponds[pondIndex].toObject();

//     // -----------------------------
//     // ✅ POND REQUIRED FIELDS VALIDATION (for update)
//     // -----------------------------
//     const pondRequiredFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking',
//       'qtySeedInitially', 'currentQty', 'waterTemperature',
//       'pH', 'DO', 'sourceOfWater'
//     ];
    
//     const missingPondFields = [];
//     pondRequiredFields.forEach(field => {
//       if (updateData[field] !== undefined && 
//           (!updateData[field] || updateData[field].toString().trim() === '')) {
//         missingPondFields.push(field);
//       }
//     });
    
//     if (missingPondFields.length > 0) {
//       return res.status(400).json({
//         error: `Pond required fields cannot be empty: ${missingPondFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATE NUMERIC FIELDS
//     // -----------------------------
//     if (updateData.pondArea && isNaN(parseFloat(updateData.pondArea))) {
//       return res.status(400).json({ error: "Pond area must be a number" });
//     }
    
//     if (updateData.pondDepth && isNaN(parseFloat(updateData.pondDepth))) {
//       return res.status(400).json({ error: "Pond depth must be a number" });
//     }
    
//     if (updateData.qtySeedInitially && isNaN(parseInt(updateData.qtySeedInitially))) {
//       return res.status(400).json({ error: "Initial seed quantity must be a number" });
//     }
    
//     if (updateData.currentQty && isNaN(parseInt(updateData.currentQty))) {
//       return res.status(400).json({ error: "Current quantity must be a number" });
//     }
    
//     if (updateData.waterTemperature && isNaN(parseFloat(updateData.waterTemperature))) {
//       return res.status(400).json({ error: "Water temperature must be a number" });
//     }
    
//     if (updateData.pH && isNaN(parseFloat(updateData.pH))) {
//       return res.status(400).json({ error: "pH must be a number" });
//     }
    
//     if (updateData.DO && isNaN(parseFloat(updateData.DO))) {
//       return res.status(400).json({ error: "DO must be a number" });
//     }

//     // Convert dates
//     if (updateData.dateOfStocking) {
//       updateData.dateOfStocking = new Date(updateData.dateOfStocking);
//     }
//     if (updateData.farmObservedDate) {
//       updateData.farmObservedDate = new Date(updateData.farmObservedDate);
//     }

//     // Track changes for history
//     const changes = {};
//     Object.keys(updateData).forEach(key => {
//       if (oldPond[key] != updateData[key]) {
//         changes[`pond.${key}`] = {
//           old: oldPond[key] || "N/A",
//           new: updateData[key]
//         };
//       }
//     });

//     // Add to update history if changes exist
//     if (Object.keys(changes).length > 0) {
//       farmer.updates.push({
//         snapshot: {
//           pondId: oldPond.pondId,
//           pondNumber: oldPond.pondNumber
//         },
//         changes,
//         createdAt: new Date()
//       });
//     }

//     // Update pond
//     farmer.ponds[pondIndex] = {
//       ...oldPond,
//       pondId: oldPond.pondId, // Never change
//       pondNumber: oldPond.pondNumber, // Never change
//       ...updateData,
//       pondImage: req.files?.pondImage?.[0]?.filename || oldPond.pondImage,
//       pondFiles: req.files?.pondFiles 
//         ? req.files.pondFiles.map(f => f.filename) 
//         : oldPond.pondFiles,
//       fishFiles: req.files?.fishFiles 
//         ? req.files.fishFiles.map(f => f.filename) 
//         : oldPond.fishFiles,
//       updatedAt: new Date()
//     };

//     await farmer.save();

//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };

//     res.json({ success: true, farmer: formattedFarmer });

//   } catch (err) {
//     console.error("UPDATE POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };





// import Farmer from "../models/farmerModel.js";
// import AccessRequest from "../models/accessRequestModel.js";

// // ----------------------------------------------------
// // 1️⃣ GET FARMERS BY AGENT (With Access Control)
// // ----------------------------------------------------
// export const getFarmersByAgent = async (req, res) => {
//   try {
//     const { agentId, viewerId } = req.query;

//     const allFarmers = await Farmer.find({ createdBy: agentId })
//       .select("name contact village photo _id") // ✅ PHOTO FIELD ADDED
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
//           return { 
//             ...fullFarmer.toObject(), 
//             accessApproved: true,
//             photo: fullFarmer.photo
//               ? `${req.protocol}://${req.get("host")}/uploads/${fullFarmer.photo}`
//               : null // ✅ PHOTO URL FORMATTED
//           };
//         }

//         return {
//           _id: farmer._id,
//           name: farmer.name,
//           contact: farmer.contact,
//           village: farmer.village,
//           photo: farmer.photo
//             ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//             : null, // ✅ PHOTO URL FORMATTED
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
// // 2️⃣ ADD FARMER (FINAL – WITH VALIDATION)
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
//     // ✅ VALIDATION: REQUIRED FIELDS
//     // -----------------------------
//     const requiredFields = [
//       'name', 'contact', 'age', 'gender', 'village', 
//       'adhar', 'familyMembers', 'familyOccupation'
//     ];
    
//     const missingFields = [];
//     requiredFields.forEach(field => {
//       if (!req.body[field] || req.body[field].toString().trim() === '') {
//         missingFields.push(field);
//       }
//     });
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: `Required fields are missing: ${missingFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: AADHAR NUMBER
//     // -----------------------------
//     if (adhar) {
//       const adharStr = adhar.toString().trim();
//       if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
//         return res.status(400).json({
//           error: "Aadhar number must be exactly 12 digits"
//         });
//       }
//     }

//     // -----------------------------
//     // FILES
//     // -----------------------------
//     const photo = req.files?.photo?.[0]
//       ? `uploads/${req.files.photo[0].filename}`
//       : "";

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

//     // Format photo URLs for all farmers
//     const formattedFarmers = farmers.map(farmer => ({
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED FOR ALL FARMERS
//     }));

//     res.status(200).json(formattedFarmers);

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
    
//     // Format photo URL
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };
    
//     res.json(formattedFarmer);
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

// // ----------------------------------------------------
// // 6️⃣ UPDATE FARMER (WITH VALIDATION)
// // ----------------------------------------------------
// export const updateFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: REQUIRED FIELDS
//     // -----------------------------
//     const requiredFields = [
//       'name', 'contact', 'age', 'gender', 'village',
//       'adhar', 'familyMembers', 'familyOccupation'
//     ];
    
//     const missingFields = [];
//     requiredFields.forEach(field => {
//       if (req.body[field] !== undefined && 
//           (!req.body[field] || req.body[field].toString().trim() === '')) {
//         missingFields.push(field);
//       }
//     });
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: `Required fields cannot be empty: ${missingFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: AADHAR NUMBER
//     // -----------------------------
//     if (req.body.adhar) {
//       const adharStr = req.body.adhar.toString().trim();
//       if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
//         return res.status(400).json({
//           error: "Aadhar number must be exactly 12 digits"
//         });
//       }
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
    
//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };
    
//     res.status(200).json(formattedFarmer);

//   } catch (err) {
//     console.error("🔥 UPDATE FARMER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 7️⃣ ADD POND (WITH VALIDATION) - UPDATE IN ROUTES
// // ----------------------------------------------------
// export const addPondWithValidation = async (req, res) => {
//   try {
//     const { farmerId } = req.params;
//     const pondData = req.body;

//     // Find farmer
//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // -----------------------------
//     // ✅ POND REQUIRED FIELDS VALIDATION
//     // -----------------------------
//     const pondRequiredFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking',
//       'qtySeedInitially', 'currentQty', 'waterTemperature',
//       'pH', 'DO', 'sourceOfWater'
//     ];
    
//     const missingPondFields = [];
//     pondRequiredFields.forEach(field => {
//       if (!pondData[field] || pondData[field].toString().trim() === '') {
//         missingPondFields.push(field);
//       }
//     });
    
//     if (missingPondFields.length > 0) {
//       return res.status(400).json({
//         error: `Pond required fields are missing: ${missingPondFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATE NUMERIC FIELDS
//     // -----------------------------
//     if (pondData.pondArea && isNaN(parseFloat(pondData.pondArea))) {
//       return res.status(400).json({ error: "Pond area must be a number" });
//     }
    
//     if (pondData.pondDepth && isNaN(parseFloat(pondData.pondDepth))) {
//       return res.status(400).json({ error: "Pond depth must be a number" });
//     }
    
//     // ✅ REMOVED: Strict numeric validation for qtySeedInitially and currentQty
    
//     if (pondData.waterTemperature && isNaN(parseFloat(pondData.waterTemperature))) {
//       return res.status(400).json({ error: "Water temperature must be a number" });
//     }
    
//     if (pondData.pH && isNaN(parseFloat(pondData.pH))) {
//       return res.status(400).json({ error: "pH must be a number" });
//     }
    
//     if (pondData.DO && isNaN(parseFloat(pondData.DO))) {
//       return res.status(400).json({ error: "DO must be a number" });
//     }

//     // ✅ ADDED: Optional safe check for length (allow numbers + text like: 1100, 13kg, 12 kg)
//     if (pondData.qtySeedInitially && pondData.qtySeedInitially.length > 20) {
//       return res.status(400).json({ error: "Initial seed quantity is too long" });
//     }

//     if (pondData.currentQty && pondData.currentQty.length > 20) {
//       return res.status(400).json({ error: "Current quantity is too long" });
//     }

//     // Create pond number
//     const pondNumber = farmer.ponds.length > 0 
//       ? Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1 
//       : 1;
    
//     const pondId = `${farmer.farmerId}-P${String(pondNumber).padStart(3, '0')}`;

//     // Create new pond object
//     const newPond = {
//       pondId,
//       pondNumber,
//       ...pondData,
//       pondImage: req.files?.pondImage?.[0]?.filename || "",
//       pondFiles: req.files?.pondFiles?.map(f => f.filename) || [],
//       fishFiles: req.files?.fishFiles?.map(f => f.filename) || [],
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     // Add pond to farmer
//     farmer.ponds.push(newPond);
//     farmer.pondCount = farmer.ponds.length;

//     await farmer.save();

//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };

//     res.json({ success: true, farmer: formattedFarmer });

//   } catch (err) {
//     console.error("ADD POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 8️⃣ UPDATE POND (WITH VALIDATION) - UPDATE IN ROUTES
// // ----------------------------------------------------
// export const updatePondWithValidation = async (req, res) => {
//   try {
//     const { farmerId, pondId } = req.params;
//     const updateData = req.body;

//     // Find farmer
//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // Find pond
//     const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
//     if (pondIndex === -1) {
//       return res.status(404).json({ error: "Pond not found" });
//     }

//     const oldPond = farmer.ponds[pondIndex].toObject();

//     // -----------------------------
//     // ✅ POND REQUIRED FIELDS VALIDATION (for update)
//     // -----------------------------
//     const pondRequiredFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking',
//       'qtySeedInitially', 'currentQty', 'waterTemperature',
//       'pH', 'DO', 'sourceOfWater'
//     ];
    
//     const missingPondFields = [];
//     pondRequiredFields.forEach(field => {
//       if (updateData[field] !== undefined && 
//           (!updateData[field] || updateData[field].toString().trim() === '')) {
//         missingPondFields.push(field);
//       }
//     });
    
//     if (missingPondFields.length > 0) {
//       return res.status(400).json({
//         error: `Pond required fields cannot be empty: ${missingPondFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATE NUMERIC FIELDS
//     // -----------------------------
//     if (updateData.pondArea && isNaN(parseFloat(updateData.pondArea))) {
//       return res.status(400).json({ error: "Pond area must be a number" });
//     }
    
//     if (updateData.pondDepth && isNaN(parseFloat(updateData.pondDepth))) {
//       return res.status(400).json({ error: "Pond depth must be a number" });
//     }
    
//     // ✅ REMOVED: Strict numeric validation for qtySeedInitially and currentQty
    
//     if (updateData.waterTemperature && isNaN(parseFloat(updateData.waterTemperature))) {
//       return res.status(400).json({ error: "Water temperature must be a number" });
//     }
    
//     if (updateData.pH && isNaN(parseFloat(updateData.pH))) {
//       return res.status(400).json({ error: "pH must be a number" });
//     }
    
//     if (updateData.DO && isNaN(parseFloat(updateData.DO))) {
//       return res.status(400).json({ error: "DO must be a number" });
//     }

//     // ✅ ADDED: Optional safe check for length (allow numbers + text like: 1100, 13kg, 12 kg)
//     if (updateData.qtySeedInitially && updateData.qtySeedInitially.length > 20) {
//       return res.status(400).json({ error: "Initial seed quantity is too long" });
//     }

//     if (updateData.currentQty && updateData.currentQty.length > 20) {
//       return res.status(400).json({ error: "Current quantity is too long" });
//     }

//     // Convert dates
//     if (updateData.dateOfStocking) {
//       updateData.dateOfStocking = new Date(updateData.dateOfStocking);
//     }
//     if (updateData.farmObservedDate) {
//       updateData.farmObservedDate = new Date(updateData.farmObservedDate);
//     }

//     // Track changes for history
//     const changes = {};
//     Object.keys(updateData).forEach(key => {
//       if (oldPond[key] != updateData[key]) {
//         changes[`pond.${key}`] = {
//           old: oldPond[key] || "N/A",
//           new: updateData[key]
//         };
//       }
//     });

//     // Add to update history if changes exist
//     if (Object.keys(changes).length > 0) {
//       farmer.updates.push({
//         snapshot: {
//           pondId: oldPond.pondId,
//           pondNumber: oldPond.pondNumber
//         },
//         changes,
//         createdAt: new Date()
//       });
//     }

//     // Update pond
//     farmer.ponds[pondIndex] = {
//       ...oldPond,
//       pondId: oldPond.pondId, // Never change
//       pondNumber: oldPond.pondNumber, // Never change
//       ...updateData,
//       pondImage: req.files?.pondImage?.[0]?.filename || oldPond.pondImage,
//       pondFiles: req.files?.pondFiles 
//         ? req.files.pondFiles.map(f => f.filename) 
//         : oldPond.pondFiles,
//       fishFiles: req.files?.fishFiles 
//         ? req.files.fishFiles.map(f => f.filename) 
//         : oldPond.fishFiles,
//       updatedAt: new Date()
//     };

//     await farmer.save();

//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };

//     res.json({ success: true, farmer: formattedFarmer });

//   } catch (err) {
//     console.error("UPDATE POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



















// import Farmer from "../models/farmerModel.js";
// import AccessRequest from "../models/accessRequestModel.js";

// // ----------------------------------------------------
// // 1️⃣ GET FARMERS BY AGENT (With Access Control)
// // ----------------------------------------------------
// export const getFarmersByAgent = async (req, res) => {
//   try {
//     const { agentId, viewerId } = req.query;

//     const allFarmers = await Farmer.find({ createdBy: agentId })
//       .select("name contact village photo _id") // ✅ PHOTO FIELD ADDED
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
//           return { 
//             ...fullFarmer.toObject(), 
//             accessApproved: true,
//             photo: fullFarmer.photo
//               ? `${req.protocol}://${req.get("host")}/uploads/${fullFarmer.photo}`
//               : null // ✅ PHOTO URL FORMATTED
//           };
//         }

//         return {
//           _id: farmer._id,
//           name: farmer.name,
//           contact: farmer.contact,
//           village: farmer.village,
//           photo: farmer.photo
//             ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//             : null, // ✅ PHOTO URL FORMATTED
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
// // 2️⃣ ADD FARMER (FINAL – WITH VALIDATION)
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
//     // ✅ VALIDATION: REQUIRED FIELDS
//     // -----------------------------
//     const requiredFields = [
//       'name', 'contact', 'age', 'gender', 'village', 
//       'adhar', 'familyMembers', 'familyOccupation'
//     ];
    
//     const missingFields = [];
//     requiredFields.forEach(field => {
//       if (!req.body[field] || req.body[field].toString().trim() === '') {
//         missingFields.push(field);
//       }
//     });
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: `Required fields are missing: ${missingFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: AADHAR NUMBER
//     // -----------------------------
//     if (adhar) {
//       const adharStr = adhar.toString().trim();
//       if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
//         return res.status(400).json({
//           error: "Aadhar number must be exactly 12 digits"
//         });
//       }
//     }

//     // -----------------------------
//     // FILES - FIXED: Remove "uploads/" prefix from filename
//     // -----------------------------
//     const photo = req.files?.photo?.[0]
//       ? req.files.photo[0].filename // ✅ CORRECT: Only filename, no "uploads/" prefix
//       : "";

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

//     // Format photo URLs for all farmers
//     const formattedFarmers = farmers.map(farmer => ({
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED FOR ALL FARMERS
//     }));

//     res.status(200).json(formattedFarmers);

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
    
//     // Format photo URL
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };
    
//     res.json(formattedFarmer);
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

// // ----------------------------------------------------
// // 6️⃣ UPDATE FARMER (WITH VALIDATION) - FIXED PHOTO PATH
// // ----------------------------------------------------
// export const updateFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: REQUIRED FIELDS
//     // -----------------------------
//     const requiredFields = [
//       'name', 'contact', 'age', 'gender', 'village',
//       'adhar', 'familyMembers', 'familyOccupation'
//     ];
    
//     const missingFields = [];
//     requiredFields.forEach(field => {
//       if (req.body[field] !== undefined && 
//           (!req.body[field] || req.body[field].toString().trim() === '')) {
//         missingFields.push(field);
//       }
//     });
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: `Required fields cannot be empty: ${missingFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATION: AADHAR NUMBER
//     // -----------------------------
//     if (req.body.adhar) {
//       const adharStr = req.body.adhar.toString().trim();
//       if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
//         return res.status(400).json({
//           error: "Aadhar number must be exactly 12 digits"
//         });
//       }
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

//     // 🔒 SAFE PHOTO UPDATE - FIXED: Remove "uploads/" prefix
//     if (req.files?.photo?.[0]) {
//       farmer.photo = req.files.photo[0].filename; // ✅ CORRECT: Only filename, no "uploads/" prefix
//     }

//     // Other files
//     if (req.files?.pondImage)
//       farmer.pondImage = req.files.pondImage[0].filename;

//     if (req.files?.pondFiles)
//       farmer.pondFiles.push(...req.files.pondFiles.map(f => f.filename));

//     if (req.files?.fishFiles)
//       farmer.fishFiles.push(...req.files.fishFiles.map(f => f.filename));

//     await farmer.save();
    
//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };
    
//     res.status(200).json(formattedFarmer);

//   } catch (err) {
//     console.error("🔥 UPDATE FARMER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 7️⃣ ADD POND (WITH VALIDATION) - UPDATE IN ROUTES
// // ----------------------------------------------------
// export const addPondWithValidation = async (req, res) => {
//   try {
//     const { farmerId } = req.params;
//     const pondData = req.body;

//     // Find farmer
//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // -----------------------------
//     // ✅ POND REQUIRED FIELDS VALIDATION
//     // -----------------------------
//     const pondRequiredFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking',
//       'qtySeedInitially', 'currentQty', 'waterTemperature',
//       'pH', 'DO', 'sourceOfWater'
//     ];
    
//     const missingPondFields = [];
//     pondRequiredFields.forEach(field => {
//       if (!pondData[field] || pondData[field].toString().trim() === '') {
//         missingPondFields.push(field);
//       }
//     });
    
//     if (missingPondFields.length > 0) {
//       return res.status(400).json({
//         error: `Pond required fields are missing: ${missingPondFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATE NUMERIC FIELDS
//     // -----------------------------
//     if (pondData.pondArea && isNaN(parseFloat(pondData.pondArea))) {
//       return res.status(400).json({ error: "Pond area must be a number" });
//     }
    
//     if (pondData.pondDepth && isNaN(parseFloat(pondData.pondDepth))) {
//       return res.status(400).json({ error: "Pond depth must be a number" });
//     }
    
//     // ✅ REMOVED: Strict numeric validation for qtySeedInitially and currentQty
    
//     if (pondData.waterTemperature && isNaN(parseFloat(pondData.waterTemperature))) {
//       return res.status(400).json({ error: "Water temperature must be a number" });
//     }
    
//     if (pondData.pH && isNaN(parseFloat(pondData.pH))) {
//       return res.status(400).json({ error: "pH must be a number" });
//     }
    
//     if (pondData.DO && isNaN(parseFloat(pondData.DO))) {
//       return res.status(400).json({ error: "DO must be a number" });
//     }

//     // ✅ ADDED: Optional safe check for length (allow numbers + text like: 1100, 13kg, 12 kg)
//     if (pondData.qtySeedInitially && pondData.qtySeedInitially.length > 20) {
//       return res.status(400).json({ error: "Initial seed quantity is too long" });
//     }

//     if (pondData.currentQty && pondData.currentQty.length > 20) {
//       return res.status(400).json({ error: "Current quantity is too long" });
//     }

//     // Create pond number
//     const pondNumber = farmer.ponds.length > 0 
//       ? Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1 
//       : 1;
    
//     const pondId = `${farmer.farmerId}-P${String(pondNumber).padStart(3, '0')}`;

//     // Create new pond object
//     const newPond = {
//       pondId,
//       pondNumber,
//       ...pondData,
//       pondImage: req.files?.pondImage?.[0]?.filename || "",
//       pondFiles: req.files?.pondFiles?.map(f => f.filename) || [],
//       fishFiles: req.files?.fishFiles?.map(f => f.filename) || [],
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     // Add pond to farmer
//     farmer.ponds.push(newPond);
//     farmer.pondCount = farmer.ponds.length;

//     await farmer.save();

//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };

//     res.json({ success: true, farmer: formattedFarmer });

//   } catch (err) {
//     console.error("ADD POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ----------------------------------------------------
// // 8️⃣ UPDATE POND (WITH VALIDATION) - UPDATE IN ROUTES
// // ----------------------------------------------------
// export const updatePondWithValidation = async (req, res) => {
//   try {
//     const { farmerId, pondId } = req.params;
//     const updateData = req.body;

//     // Find farmer
//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ error: "Farmer not found" });
//     }

//     // Find pond
//     const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
//     if (pondIndex === -1) {
//       return res.status(404).json({ error: "Pond not found" });
//     }

//     const oldPond = farmer.ponds[pondIndex].toObject();

//     // -----------------------------
//     // ✅ POND REQUIRED FIELDS VALIDATION (for update)
//     // -----------------------------
//     const pondRequiredFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking',
//       'qtySeedInitially', 'currentQty', 'waterTemperature',
//       'pH', 'DO', 'sourceOfWater'
//     ];
    
//     const missingPondFields = [];
//     pondRequiredFields.forEach(field => {
//       if (updateData[field] !== undefined && 
//           (!updateData[field] || updateData[field].toString().trim() === '')) {
//         missingPondFields.push(field);
//       }
//     });
    
//     if (missingPondFields.length > 0) {
//       return res.status(400).json({
//         error: `Pond required fields cannot be empty: ${missingPondFields.join(', ')}`
//       });
//     }

//     // -----------------------------
//     // ✅ VALIDATE NUMERIC FIELDS
//     // -----------------------------
//     if (updateData.pondArea && isNaN(parseFloat(updateData.pondArea))) {
//       return res.status(400).json({ error: "Pond area must be a number" });
//     }
    
//     if (updateData.pondDepth && isNaN(parseFloat(updateData.pondDepth))) {
//       return res.status(400).json({ error: "Pond depth must be a number" });
//     }
    
//     // ✅ REMOVED: Strict numeric validation for qtySeedInitially and currentQty
    
//     if (updateData.waterTemperature && isNaN(parseFloat(updateData.waterTemperature))) {
//       return res.status(400).json({ error: "Water temperature must be a number" });
//     }
    
//     if (updateData.pH && isNaN(parseFloat(updateData.pH))) {
//       return res.status(400).json({ error: "pH must be a number" });
//     }
    
//     if (updateData.DO && isNaN(parseFloat(updateData.DO))) {
//       return res.status(400).json({ error: "DO must be a number" });
//     }

//     // ✅ ADDED: Optional safe check for length (allow numbers + text like: 1100, 13kg, 12 kg)
//     if (updateData.qtySeedInitially && updateData.qtySeedInitially.length > 20) {
//       return res.status(400).json({ error: "Initial seed quantity is too long" });
//     }

//     if (updateData.currentQty && updateData.currentQty.length > 20) {
//       return res.status(400).json({ error: "Current quantity is too long" });
//     }

//     // Convert dates
//     if (updateData.dateOfStocking) {
//       updateData.dateOfStocking = new Date(updateData.dateOfStocking);
//     }
//     if (updateData.farmObservedDate) {
//       updateData.farmObservedDate = new Date(updateData.farmObservedDate);
//     }

//     // Track changes for history
//     const changes = {};
//     Object.keys(updateData).forEach(key => {
//       if (oldPond[key] != updateData[key]) {
//         changes[`pond.${key}`] = {
//           old: oldPond[key] || "N/A",
//           new: updateData[key]
//         };
//       }
//     });

//     // Add to update history if changes exist
//     if (Object.keys(changes).length > 0) {
//       farmer.updates.push({
//         snapshot: {
//           pondId: oldPond.pondId,
//           pondNumber: oldPond.pondNumber
//         },
//         changes,
//         createdAt: new Date()
//       });
//     }

//     // Update pond
//     farmer.ponds[pondIndex] = {
//       ...oldPond,
//       pondId: oldPond.pondId, // Never change
//       pondNumber: oldPond.pondNumber, // Never change
//       ...updateData,
//       pondImage: req.files?.pondImage?.[0]?.filename || oldPond.pondImage,
//       pondFiles: req.files?.pondFiles 
//         ? req.files.pondFiles.map(f => f.filename) 
//         : oldPond.pondFiles,
//       fishFiles: req.files?.fishFiles 
//         ? req.files.fishFiles.map(f => f.filename) 
//         : oldPond.fishFiles,
//       updatedAt: new Date()
//     };

//     await farmer.save();

//     // Format photo URL for response
//     const formattedFarmer = {
//       ...farmer.toObject(),
//       photo: farmer.photo 
//         ? `${req.protocol}://${req.get("host")}/uploads/${farmer.photo}`
//         : null // ✅ PHOTO URL FORMATTED
//     };

//     res.json({ success: true, farmer: formattedFarmer });

//   } catch (err) {
//     console.error("UPDATE POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };























import Farmer from "../models/farmerModel.js";
import AccessRequest from "../models/accessRequestModel.js";

// ----------------------------------------------------
// 1️⃣ GET FARMERS BY AGENT (With Access Control)
// ----------------------------------------------------
export const getFarmersByAgent = async (req, res) => {
  try {
    const { agentId, viewerId } = req.query;

    const allFarmers = await Farmer.find({ createdBy: agentId })
      .select("name contact village photo _id") // ✅ PHOTO FIELD ADDED
      .sort({ name: 1 });

    const farmersWithAccess = await Promise.all(
      allFarmers.map(async (farmer) => {
        const access = await AccessRequest.findOne({
          requesterId: viewerId,
          targetFarmerId: farmer._id,
          status: "approved",
        });

        if (access) {
          const fullFarmer = await Farmer.findById(farmer._id);
          return { 
            ...fullFarmer.toObject(), 
            accessApproved: true,
            photo: fullFarmer.photo
              ? `${req.protocol}://${req.get("host")}/${fullFarmer.photo}`
              : null // ✅ PHOTO URL FORMATTED (CHANGED)
          };
        }

        return {
          _id: farmer._id,
          name: farmer.name,
          contact: farmer.contact,
          village: farmer.village,
          photo: farmer.photo
            ? `${req.protocol}://${req.get("host")}/${farmer.photo}`
            : null, // ✅ PHOTO URL FORMATTED (CHANGED)
          accessApproved: false,
        };
      })
    );

    res.json({
      approved: farmersWithAccess.some(f => f.accessApproved),
      farmers: farmersWithAccess
    });

  } catch (err) {
    console.error("🔥 GET FARMERS BY AGENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// 2️⃣ ADD FARMER (FINAL – WITH VALIDATION)
// ----------------------------------------------------
export const addFarmer = async (req, res) => {
  try {
    console.log("🔥 ADD FARMER BODY:", req.body);

    const {
      name, contact, age, gender, village, pondCount,
      adhar, familyMembers, familyOccupation,
      userId
    } = req.body;

    // -----------------------------
    // ✅ VALIDATION: REQUIRED FIELDS
    // -----------------------------
    const requiredFields = [
      'name', 'contact', 'age', 'gender', 'village', 
      'adhar', 'familyMembers', 'familyOccupation'
    ];
    
    const missingFields = [];
    requiredFields.forEach(field => {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Required fields are missing: ${missingFields.join(', ')}`
      });
    }

    // -----------------------------
    // ✅ VALIDATION: AADHAR NUMBER
    // -----------------------------
    if (adhar) {
      const adharStr = adhar.toString().trim();
      if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
        return res.status(400).json({
          error: "Aadhar number must be exactly 12 digits"
        });
      }
    }

    // -----------------------------
    // FILES - FIXED: Remove "uploads/" prefix from filename
    // -----------------------------
    const photo = req.files?.photo?.[0]
      ? req.files.photo[0].filename // ✅ CORRECT: Only filename, no "uploads/" prefix
      : "";

    // DEBUG लाइनें add करो
    console.log("📸 Photo filename being saved:", photo);
    console.log("📸 Full farmer photo path:", `${req.protocol}://${req.get("host")}/${photo}`);

    const pondImage = req.files?.pondImage?.[0]?.filename || "";
    const pondFiles = req.files?.pondFiles?.map(f => f.filename) || [];
    const fishFiles = req.files?.fishFiles?.map(f => f.filename) || [];

    // -----------------------------
    // ✅ FIX 1: SAFE POND COUNT
    // -----------------------------
    const totalPonds = parseInt(pondCount || 0);
    let pondsArray = [];

    if (totalPonds > 0) {
      for (let i = 1; i <= totalPonds; i++) {
        const tempPondId = `TEMP-${Date.now()}-${i}-${Math.random()
          .toString(36)
          .substring(2, 7)}`;

        pondsArray.push({
          pondId: tempPondId, // ✅ never null
          pondNumber: i,
          pondArea: req.body[`pondArea${i}`] || "",
          pondDepth: req.body[`pondDepth${i}`] || "",
          overflow: req.body[`overflow${i}`] || "",
          receivesSunlight: req.body[`receivesSunlight${i}`] || "",
          treesOnBanks: req.body[`treesOnBanks${i}`] || "",
          neighbourhood: req.body[`neighbourhood${i}`] || "",
          wastewaterEnters: req.body[`wastewaterEnters${i}`] || ""
        });
      }
    }

    // -----------------------------
    // 2️⃣ CREATE FARMER
    // -----------------------------
    const newFarmer = new Farmer({
      userId,
      createdBy: userId,
      name,
      contact,
      age,
      gender,
      village,
      pondCount: totalPonds,
      adhar,
      familyMembers,
      familyOccupation,
      photo,
      pondImage,
      pondFiles,
      fishFiles,
      ...(pondsArray.length > 0 && { ponds: pondsArray })
    });

    await newFarmer.save(); // ✅ FIRST SAVE

    // -----------------------------
    // 3️⃣ FINAL POND IDS
    // -----------------------------
    if (newFarmer.ponds && newFarmer.ponds.length > 0) {
      newFarmer.ponds = newFarmer.ponds.map((p, i) => ({
        ...p._doc,
        pondId: `POND-${newFarmer.farmerId}-${String(i + 1).padStart(3, "0")}`
      }));

      await newFarmer.save(); // ✅ SECOND SAVE
    }

    res.status(201).json(newFarmer);

  } catch (err) {
    console.error("🔥 ADD FARMER ERROR:", err);
    res.status(500).json({
      error: err.message,
      details: "If error persists, drop ponds.pondId index from MongoDB"
    });
  }
};

// ----------------------------------------------------
// 3️⃣ GET FARMERS (Own + Approved Shared)
// ----------------------------------------------------
export const getFarmers = async (req, res) => {
  try {
    const includeShared = req.query.includeShared === "true";
    const userId = req.query.userId;

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

    // Format photo URLs for all farmers
    const formattedFarmers = farmers.map(farmer => ({
      ...farmer.toObject(),
      photo: farmer.photo 
        ? `${req.protocol}://${req.get("host")}/${farmer.photo}`
        : null // ✅ PHOTO URL FORMATTED FOR ALL FARMERS (CHANGED)
    }));

    res.status(200).json(formattedFarmers);

  } catch (err) {
    console.error("🔥 GET FARMERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// 4️⃣ GET SINGLE FARMER
// ----------------------------------------------------
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    
    // Format photo URL
    const formattedFarmer = {
      ...farmer.toObject(),
      photo: farmer.photo 
        ? `${req.protocol}://${req.get("host")}/${farmer.photo}`
        : null // ✅ PHOTO URL FORMATTED (CHANGED)
    };
    
    res.json(formattedFarmer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// 5️⃣ DELETE FARMER
// ----------------------------------------------------
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    res.json({ message: "Farmer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// 6️⃣ UPDATE FARMER (WITH VALIDATION) - FIXED PHOTO PATH
// ----------------------------------------------------
export const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // -----------------------------
    // ✅ VALIDATION: REQUIRED FIELDS
    // -----------------------------
    const requiredFields = [
      'name', 'contact', 'age', 'gender', 'village',
      'adhar', 'familyMembers', 'familyOccupation'
    ];
    
    const missingFields = [];
    requiredFields.forEach(field => {
      if (req.body[field] !== undefined && 
          (!req.body[field] || req.body[field].toString().trim() === '')) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Required fields cannot be empty: ${missingFields.join(', ')}`
      });
    }

    // -----------------------------
    // ✅ VALIDATION: AADHAR NUMBER
    // -----------------------------
    if (req.body.adhar) {
      const adharStr = req.body.adhar.toString().trim();
      if (adharStr.length !== 12 || !/^\d+$/.test(adharStr)) {
        return res.status(400).json({
          error: "Aadhar number must be exactly 12 digits"
        });
      }
    }

    // 🔒 SAFE BODY UPDATE
    Object.keys(req.body).forEach(key => {
      if (
        !["userId", "ponds", "farmerId", "photo"].includes(key) &&
        req.body[key] !== ""
      ) {
        farmer[key] = req.body[key];
      }
    });

    // 🔒 SAFE PHOTO UPDATE - FIXED: Remove "uploads/" prefix
    if (req.files?.photo?.[0]) {
      farmer.photo = req.files.photo[0].filename; // ✅ CORRECT: Only filename, no "uploads/" prefix
      
      // DEBUG लाइनें add करो
      console.log("📸 Update - Photo filename being saved:", farmer.photo);
      console.log("📸 Update - Full farmer photo path:", `${req.protocol}://${req.get("host")}/${farmer.photo}`);
    }

    // Other files
    if (req.files?.pondImage)
      farmer.pondImage = req.files.pondImage[0].filename;

    if (req.files?.pondFiles)
      farmer.pondFiles.push(...req.files.pondFiles.map(f => f.filename));

    if (req.files?.fishFiles)
      farmer.fishFiles.push(...req.files.fishFiles.map(f => f.filename));

    await farmer.save();
    
    // Format photo URL for response
    const formattedFarmer = {
      ...farmer.toObject(),
      photo: farmer.photo 
        ? `${req.protocol}://${req.get("host")}/${farmer.photo}`
        : null // ✅ PHOTO URL FORMATTED (CHANGED)
    };
    
    res.status(200).json(formattedFarmer);

  } catch (err) {
    console.error("🔥 UPDATE FARMER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// 7️⃣ ADD POND (WITH VALIDATION) - UPDATE IN ROUTES
// ----------------------------------------------------
export const addPondWithValidation = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const pondData = req.body;

    // Find farmer
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // -----------------------------
    // ✅ POND REQUIRED FIELDS VALIDATION
    // -----------------------------
    const pondRequiredFields = [
      'pondArea', 'pondDepth', 'species', 'dateOfStocking',
      'qtySeedInitially', 'currentQty', 'waterTemperature',
      'pH', 'DO', 'sourceOfWater'
    ];
    
    const missingPondFields = [];
    pondRequiredFields.forEach(field => {
      if (!pondData[field] || pondData[field].toString().trim() === '') {
        missingPondFields.push(field);
      }
    });
    
    if (missingPondFields.length > 0) {
      return res.status(400).json({
        error: `Pond required fields are missing: ${missingPondFields.join(', ')}`
      });
    }

    // -----------------------------
    // ✅ VALIDATE NUMERIC FIELDS
    // -----------------------------
    if (pondData.pondArea && isNaN(parseFloat(pondData.pondArea))) {
      return res.status(400).json({ error: "Pond area must be a number" });
    }
    
    if (pondData.pondDepth && isNaN(parseFloat(pondData.pondDepth))) {
      return res.status(400).json({ error: "Pond depth must be a number" });
    }
    
    // ✅ REMOVED: Strict numeric validation for qtySeedInitially and currentQty
    
    if (pondData.waterTemperature && isNaN(parseFloat(pondData.waterTemperature))) {
      return res.status(400).json({ error: "Water temperature must be a number" });
    }
    
    if (pondData.pH && isNaN(parseFloat(pondData.pH))) {
      return res.status(400).json({ error: "pH must be a number" });
    }
    
    if (pondData.DO && isNaN(parseFloat(pondData.DO))) {
      return res.status(400).json({ error: "DO must be a number" });
    }

    // ✅ ADDED: Optional safe check for length (allow numbers + text like: 1100, 13kg, 12 kg)
    if (pondData.qtySeedInitially && pondData.qtySeedInitially.length > 20) {
      return res.status(400).json({ error: "Initial seed quantity is too long" });
    }

    if (pondData.currentQty && pondData.currentQty.length > 20) {
      return res.status(400).json({ error: "Current quantity is too long" });
    }

    // Create pond number
    const pondNumber = farmer.ponds.length > 0 
      ? Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1 
      : 1;
    
    const pondId = `${farmer.farmerId}-P${String(pondNumber).padStart(3, '0')}`;

    // Create new pond object
    const newPond = {
      pondId,
      pondNumber,
      ...pondData,
      pondImage: req.files?.pondImage?.[0]?.filename || "",
      pondFiles: req.files?.pondFiles?.map(f => f.filename) || [],
      fishFiles: req.files?.fishFiles?.map(f => f.filename) || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add pond to farmer
    farmer.ponds.push(newPond);
    farmer.pondCount = farmer.ponds.length;

    await farmer.save();

    // Format photo URL for response
    const formattedFarmer = {
      ...farmer.toObject(),
      photo: farmer.photo 
        ? `${req.protocol}://${req.get("host")}/${farmer.photo}`
        : null // ✅ PHOTO URL FORMATTED (CHANGED)
    };

    res.json({ success: true, farmer: formattedFarmer });

  } catch (err) {
    console.error("ADD POND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// 8️⃣ UPDATE POND (WITH VALIDATION) - UPDATE IN ROUTES
// ----------------------------------------------------
export const updatePondWithValidation = async (req, res) => {
  try {
    const { farmerId, pondId } = req.params;
    const updateData = req.body;

    // Find farmer
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // Find pond
    const pondIndex = farmer.ponds.findIndex(p => p.pondId === pondId);
    if (pondIndex === -1) {
      return res.status(404).json({ error: "Pond not found" });
    }

    const oldPond = farmer.ponds[pondIndex].toObject();

    // -----------------------------
    // ✅ POND REQUIRED FIELDS VALIDATION (for update)
    // -----------------------------
    const pondRequiredFields = [
      'pondArea', 'pondDepth', 'species', 'dateOfStocking',
      'qtySeedInitially', 'currentQty', 'waterTemperature',
      'pH', 'DO', 'sourceOfWater'
    ];
    
    const missingPondFields = [];
    pondRequiredFields.forEach(field => {
      if (updateData[field] !== undefined && 
          (!updateData[field] || updateData[field].toString().trim() === '')) {
        missingPondFields.push(field);
      }
    });
    
    if (missingPondFields.length > 0) {
      return res.status(400).json({
        error: `Pond required fields cannot be empty: ${missingPondFields.join(', ')}`
      });
    }

    // -----------------------------
    // ✅ VALIDATE NUMERIC FIELDS
    // -----------------------------
    if (updateData.pondArea && isNaN(parseFloat(updateData.pondArea))) {
      return res.status(400).json({ error: "Pond area must be a number" });
    }
    
    if (updateData.pondDepth && isNaN(parseFloat(updateData.pondDepth))) {
      return res.status(400).json({ error: "Pond depth must be a number" });
    }
    
    // ✅ REMOVED: Strict numeric validation for qtySeedInitially and currentQty
    
    if (updateData.waterTemperature && isNaN(parseFloat(updateData.waterTemperature))) {
      return res.status(400).json({ error: "Water temperature must be a number" });
    }
    
    if (updateData.pH && isNaN(parseFloat(updateData.pH))) {
      return res.status(400).json({ error: "pH must be a number" });
    }
    
    if (updateData.DO && isNaN(parseFloat(updateData.DO))) {
      return res.status(400).json({ error: "DO must be a number" });
    }

    // ✅ ADDED: Optional safe check for length (allow numbers + text like: 1100, 13kg, 12 kg)
    if (updateData.qtySeedInitially && updateData.qtySeedInitially.length > 20) {
      return res.status(400).json({ error: "Initial seed quantity is too long" });
    }

    if (updateData.currentQty && updateData.currentQty.length > 20) {
      return res.status(400).json({ error: "Current quantity is too long" });
    }

    // Convert dates
    if (updateData.dateOfStocking) {
      updateData.dateOfStocking = new Date(updateData.dateOfStocking);
    }
    if (updateData.farmObservedDate) {
      updateData.farmObservedDate = new Date(updateData.farmObservedDate);
    }

    // Track changes for history
    const changes = {};
    Object.keys(updateData).forEach(key => {
      if (oldPond[key] != updateData[key]) {
        changes[`pond.${key}`] = {
          old: oldPond[key] || "N/A",
          new: updateData[key]
        };
      }
    });

    // Add to update history if changes exist
    if (Object.keys(changes).length > 0) {
      farmer.updates.push({
        snapshot: {
          pondId: oldPond.pondId,
          pondNumber: oldPond.pondNumber
        },
        changes,
        createdAt: new Date()
      });
    }

    // Update pond
    farmer.ponds[pondIndex] = {
      ...oldPond,
      pondId: oldPond.pondId, // Never change
      pondNumber: oldPond.pondNumber, // Never change
      ...updateData,
      pondImage: req.files?.pondImage?.[0]?.filename || oldPond.pondImage,
      pondFiles: req.files?.pondFiles 
        ? req.files.pondFiles.map(f => f.filename) 
        : oldPond.pondFiles,
      fishFiles: req.files?.fishFiles 
        ? req.files.fishFiles.map(f => f.filename) 
        : oldPond.fishFiles,
      updatedAt: new Date()
    };

    await farmer.save();

    // Format photo URL for response
    const formattedFarmer = {
      ...farmer.toObject(),
      photo: farmer.photo 
        ? `${req.protocol}://${req.get("host")}/${farmer.photo}`
        : null // ✅ PHOTO URL FORMATTED (CHANGED)
    };

    res.json({ success: true, farmer: formattedFarmer });

  } catch (err) {
    console.error("UPDATE POND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};