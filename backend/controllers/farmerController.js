

// // niche vala sahi hai

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
















// // uper vala sahi hai 
















//buffer version 

import Farmer from "../models/farmerModel.js";
import AccessRequest from "../models/accessRequestModel.js";
import Counter from "../models/counterModel.js";

// ---------------------------
// GET FARMERS BY AGENT
// ---------------------------
export const getFarmersByAgent = async (req, res) => {
  try {
    const { agentId, viewerId } = req.query;
    const allFarmers = await Farmer.find({ createdBy: agentId })
      .select("name contact village photo _id farmerId")
      .sort({ name: 1 });

    // Convert Buffer to Base64 for photo
    const farmersWithPhoto = allFarmers.map(farmer => {
      const farmerObj = farmer.toObject();
      if (farmerObj.photo && Buffer.isBuffer(farmerObj.photo)) {
        farmerObj.photo = `data:image/jpeg;base64,${farmerObj.photo.toString('base64')}`;
      }
      return farmerObj;
    });

    const farmersWithAccess = await Promise.all(
      farmersWithPhoto.map(async (farmer) => {
        const access = await AccessRequest.findOne({
          requesterId: viewerId,
          targetFarmerId: farmer._id,
          status: "approved",
        });

        return {
          ...farmer,
          accessApproved: !!access
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

// ---------------------------
// ADD FARMER (Buffer Files) - FIXED VERSION
// ---------------------------
export const addFarmer = async (req, res) => {
  try {
    console.log("📝 ADD FARMER REQUEST BODY:", req.body);
    console.log("📸 FILES:", req.files);

    const { name, contact, age, gender, village, pondCount, adhar, familyMembers, familyOccupation, userId } = req.body;

    // Validation
    const requiredFields = ['name','contact','age','gender','village','adhar','familyMembers','familyOccupation'];
    const missingFields = requiredFields.filter(f => !req.body[f]);
    if (missingFields.length) return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });

    if (adhar && (adhar.length !== 12 || !/^\d+$/.test(adhar))) {
      return res.status(400).json({ error: "Aadhar must be 12 digits" });
    }

    // Files in Buffer
    const photo = req.files?.photo?.[0]?.buffer || null;

    // Validate required files
    if (!photo) return res.status(400).json({ error: "Farmer photo is required" });

    // Pond array - FIXED: ponds को required field है, इसलिए empty array दें
    const totalPonds = parseInt(pondCount || 0);
    const pondsArray = []; // ✅ Empty array for now
    
    // ✅ GENERATE FARMER ID
    const year = new Date().getFullYear();
    const counter = await Counter.findOneAndUpdate(
      { id: "farmer" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const serial = String(counter.seq).padStart(5, "0");
    const farmerId = `FAR-${year}-${serial}`;
    
    console.log("✅ Generated farmerId:", farmerId);

    // Create ponds if any (for future use when pondCount > 0)
    if (totalPonds > 0) {
      const pondImage = req.files?.pondImage?.[0]?.buffer || null;
      const pondFiles = req.files?.pondFiles?.map(f => f.buffer) || [];
      const fishFiles = req.files?.fishFiles?.map(f => f.buffer) || [];
      
      for (let i = 1; i <= totalPonds; i++) {
        const pondData = {
          pondId: `${farmerId}-P${i}`,
          pondNumber: i,
          pondArea: req.body[`pondArea${i}`] || "",
          pondAreaUnit: req.body[`pondAreaUnit${i}`] || "acre",
          pondDepth: req.body[`pondDepth${i}`] || "",
          pondImage: pondImage || Buffer.from([]),
          overflow: req.body[`overflow${i}`] || "No",
          receivesSunlight: req.body[`receivesSunlight${i}`] || "Yes",
          treesOnBanks: req.body[`treesOnBanks${i}`] || "No",
          neighbourhood: req.body[`neighbourhood${i}`] || "Agriculture Farm",
          wastewaterEnters: req.body[`wastewaterEnters${i}`] || "No",
          species: req.body[`species${i}`] || "",
          dateOfStocking: req.body[`dateOfStocking${i}`] || new Date(),
          qtySeedInitially: req.body[`qtySeedInitially${i}`] || "",
          currentQty: req.body[`currentQty${i}`] || "",
          avgSize: req.body[`avgSize${i}`] || ">200gram",
          feedType: req.body[`feedType${i}`] || "Market Feed",
          feedOther: req.body[`feedOther${i}`] || "",
          feedFreq: req.body[`feedFreq${i}`] || "Once a day",
          feedQtyPerDay: req.body[`feedQtyPerDay${i}`] || "",
          feedTime: req.body[`feedTime${i}`] || "6:00 am-10:00am",
          recentFeedChanges: req.body[`recentFeedChanges${i}`] || "",
          reducedAppetite: req.body[`reducedAppetite${i}`] || "No",
          waterTemperature: req.body[`waterTemperature${i}`] || "",
          pH: req.body[`pH${i}`] || "",
          DO: req.body[`DO${i}`] || "",
          ammoniaLevel: req.body[`ammoniaLevel${i}`] || "Medium",
          phytoplanktonLevel: req.body[`phytoplanktonLevel${i}`] || "Medium",
          waterHardness: req.body[`waterHardness${i}`] || "1",
          algaeBloom: req.body[`algaeBloom${i}`] || "No",
          pondWaterColor: req.body[`pondWaterColor${i}`] || "Light Green",
          sourceOfWater: req.body[`sourceOfWater${i}`] || "Rainwater",
          diseaseSymptoms: req.body[`diseaseSymptoms${i}`] || "No",
          symptomsObserved: req.body[`symptomsObserved${i}`] || "",
          fishDeaths: req.body[`fishDeaths${i}`] || "",
          symptomsAffect: req.body[`symptomsAffect${i}`] || "All",
          farmObservedDate: req.body[`farmObservedDate${i}`] || new Date(),
          farmObservedTime: req.body[`farmObservedTime${i}`] || "",
          lastSpecies: req.body[`lastSpecies${i}`] || "",
          lastHarvestComplete: req.body[`lastHarvestComplete${i}`] || "Yes",
          recentRainFlood: req.body[`recentRainFlood${i}`] || "No",
          pesticideRunoff: req.body[`pesticideRunoff${i}`] || "No",
          constructionNear: req.body[`constructionNear${i}`] || "No",
          suddenTempChange: req.body[`suddenTempChange${i}`] || "No",
          notes: req.body[`notes${i}`] || "",
          pondFiles: pondFiles,
          fishFiles: fishFiles,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        pondsArray.push(pondData);
      }
    }

    // ✅ CREATE FARMER WITH PROPER STRUCTURE
    const newFarmer = new Farmer({
      farmerId: farmerId, // ✅ Set farmerId manually
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
      pondFiles: totalPonds > 0 ? (req.files?.pondFiles?.map(f => f.buffer) || []) : [],
      fishFiles: totalPonds > 0 ? (req.files?.fishFiles?.map(f => f.buffer) || []) : [],
      ponds: pondsArray, // ✅ Required field - can be empty array
      updates: [] // ✅ Empty array
    });

    console.log("📋 Farmer object before save:", {
      farmerId: newFarmer.farmerId,
      name: newFarmer.name,
      pondCount: newFarmer.pondCount,
      hasPhoto: !!newFarmer.photo,
      pondsCount: newFarmer.ponds.length
    });

    await newFarmer.save();
    console.log("✅ Farmer saved successfully");
    
    // Convert buffer to base64 for response
    const responseFarmer = newFarmer.toObject();
    if (responseFarmer.photo) {
      responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
    }
    
    res.status(201).json(responseFarmer);

  } catch (err) {
    console.error("🔥 ADD FARMER ERROR:", err);
    res.status(500).json({ 
      error: err.message,
      details: err.stack 
    });
  }
};

// ---------------------------
// GET FARMERS
// ---------------------------
export const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({ createdBy: req.query.userId });
    
    // Convert buffers to base64
    const farmersWithBase64 = farmers.map(farmer => {
      const farmerObj = farmer.toObject();
      if (farmerObj.photo) {
        farmerObj.photo = `data:image/jpeg;base64,${farmerObj.photo.toString('base64')}`;
      }
      
      // Convert pond images
      if (farmerObj.ponds && farmerObj.ponds.length > 0) {
        farmerObj.ponds = farmerObj.ponds.map(pond => {
          if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
            pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
          }
          return pond;
        });
      }
      
      return farmerObj;
    });
    
    res.json(farmersWithBase64);
  } catch (err) {
    console.error("🔥 GET FARMERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// GET FARMER BY ID
// ---------------------------
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.getFarmerByAnyId(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    
    // Convert buffers to base64
    const farmerObj = farmer.toObject();
    if (farmerObj.photo) {
      farmerObj.photo = `data:image/jpeg;base64,${farmerObj.photo.toString('base64')}`;
    }
    
    // Convert pond images
    if (farmerObj.ponds) {
      farmerObj.ponds = farmerObj.ponds.map(pond => {
        if (pond.pondImage && Buffer.isBuffer(pond.pondImage)) {
          pond.pondImage = `data:image/jpeg;base64,${pond.pondImage.toString('base64')}`;
        }
        return pond;
      });
    }
    
    res.json(farmerObj);
  } catch (err) {
    console.error("🔥 GET FARMER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// UPDATE FARMER (Buffer)
// ---------------------------
export const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    // Save old data for history
    const oldFarmerData = farmer.toObject();

    // Update fields
    Object.keys(req.body).forEach(key => { 
      if (req.body[key] !== undefined && 
          !['farmerId', '_id', 'createdAt', 'updatedAt'].includes(key)) {
        farmer[key] = req.body[key]; 
      }
    });

    // Update buffers
    if (req.files?.photo) farmer.photo = req.files.photo[0].buffer;
    
    // Update pond images if new pondImage uploaded
    if (req.files?.pondImage && farmer.ponds.length > 0) {
      farmer.ponds.forEach(pond => {
        pond.pondImage = req.files.pondImage[0].buffer;
      });
    }
    
    if (req.files?.pondFiles) farmer.pondFiles.push(...req.files.pondFiles.map(f => f.buffer));
    if (req.files?.fishFiles) farmer.fishFiles.push(...req.files.fishFiles.map(f => f.buffer));

    // Track changes for history
    const changes = {};
    Object.keys(req.body).forEach(key => {
      if (!['userId', 'farmerId'].includes(key) && 
          oldFarmerData[key] != req.body[key]) {
        changes[key] = {
          old: oldFarmerData[key] || "N/A",
          new: req.body[key]
        };
      }
    });

    // Add to updates history
    if (Object.keys(changes).length > 0) {
      farmer.updates.push({
        snapshot: oldFarmerData,
        changes,
        pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
        fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
        updatedBy: req.body.userId || farmer.userId,
        createdAt: new Date()
      });
    }

    await farmer.save();
    
    // Convert buffer to base64 for response
    const responseFarmer = farmer.toObject();
    if (responseFarmer.photo) {
      responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
    }
    
    res.json(responseFarmer);
  } catch (err) {
    console.error("🔥 UPDATE FARMER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// ADD POND TO FARMER
// ---------------------------
export const addPondToFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const pondData = req.body;

    const farmer = await Farmer.getFarmerByAnyId(farmerId);
    if (!farmer)
      return res.status(404).json({ error: "Farmer not found" });

    // Validate required fields
    const requiredPondFields = [
      'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
      'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
      'farmObservedDate', 'farmObservedTime'
    ];
    
    for (const field of requiredPondFields) {
      if (!pondData[field]) {
        return res.status(400).json({ 
          error: `Please fill required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}` 
        });
      }
    }

    const pondNumber = farmer.ponds.length > 0 
      ? Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1 
      : 1;
    
    const newPondId = `${farmer.farmerId}-P${pondNumber}`;

    // Create new pond object
    const newPond = {
      pondId: newPondId,
      pondNumber,
      ...pondData,
      pondImage: req.files?.pondImage?.[0]?.buffer || Buffer.from([]),
      pondFiles: req.files?.pondFiles?.map(f => f.buffer) || [],
      fishFiles: req.files?.fishFiles?.map(f => f.buffer) || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add pond to farmer
    farmer.ponds.push(newPond);
    farmer.pondCount = farmer.ponds.length;

    await farmer.save();

    // Convert buffers to base64 for response
    const responseFarmer = farmer.toObject();
    if (responseFarmer.photo) {
      responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
    }

    res.json({ success: true, farmer: responseFarmer });
  } catch (err) {
    console.error("ADD POND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// UPDATE POND
// ---------------------------
export const updatePond = async (req, res) => {
  try {
    const { farmerId, pondId } = req.params;
    const updateData = req.body;

    const farmer = await Farmer.getFarmerByAnyId(farmerId);
    if (!farmer)
      return res.status(404).json({ error: "Farmer not found" });

    const pondIndex = farmer.ponds.findIndex(
      p => p.pondId === pondId
    );
    
    if (pondIndex === -1)
      return res.status(404).json({ error: "Pond not found" });

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
    farmer.ponds[pondIndex] = {
      ...oldPond,

      // 🔒 pondId & pondNumber NEVER CHANGE
      pondId: oldPond.pondId,
      pondNumber: oldPond.pondNumber,

      ...updateData,

      pondImage:
        req.files?.pondImage?.[0]?.buffer ||
        oldPond.pondImage,

      pondFiles: req.files?.pondFiles
        ? req.files.pondFiles.map(f => f.buffer)
        : oldPond.pondFiles,

      fishFiles: req.files?.fishFiles
        ? req.files.fishFiles.map(f => f.buffer)
        : oldPond.fishFiles,

      updatedAt: new Date()
    };

    await farmer.save();

    // Convert buffers to base64 for response
    const responseFarmer = farmer.toObject();
    if (responseFarmer.photo) {
      responseFarmer.photo = `data:image/jpeg;base64,${responseFarmer.photo.toString('base64')}`;
    }

    res.json({ success: true, farmer: responseFarmer });
  } catch (err) {
    console.error("UPDATE POND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};