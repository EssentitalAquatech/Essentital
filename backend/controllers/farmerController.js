

// import Farmer from "../models/farmerModel.js";
// import AccessRequest from "../models/accessRequestModel.js";
// import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "../config/cloudinary.js";

// // ---------------------------
// // GET FARMERS BY AGENT
// // ---------------------------
// export const getFarmersByAgent = async (req, res) => {
//   try {
//     const { agentId, viewerId } = req.query;
//     const allFarmers = await Farmer.find({ createdBy: agentId })
//       .select("name contact village photo _id farmerId")
//       .sort({ name: 1 });

//     // Cloudinary URLs are already stored, no need to convert
//     const farmersWithAccess = await Promise.all(
//       allFarmers.map(async (farmer) => {
//         const farmerObj = farmer.toObject();
//         const access = await AccessRequest.findOne({
//           requesterId: viewerId,
//           targetFarmerId: farmer._id,
//           status: "approved",
//         });

//         return {
//           ...farmerObj,
//           accessApproved: !!access
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

// // ---------------------------
// // ADD FARMER (with Cloudinary)
// // ---------------------------
// export const addFarmer = async (req, res) => {
//   try {
//     console.log("📝 ADD FARMER REQUEST BODY:", req.body);
//     console.log("📸 FILES:", req.files);

//     const { name, contact, age, gender, village, pondCount, adhar, familyMembers, familyOccupation, userId } = req.body;

//     // Validation
//     const requiredFields = ['name','contact','age','gender','village','adhar','familyMembers','familyOccupation'];
//     const missingFields = requiredFields.filter(f => !req.body[f]);
//     if (missingFields.length) return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });

//     // 📞 Phone validation
//     if (!/^\d{10}$/.test(contact)) {
//       return res.status(400).json({
//         error: "Phone number must be exactly 10 digits and numeric only"
//       });
//     }

//     // 🆔 Aadhar validation
//     if (!/^\d{12}$/.test(adhar)) {
//       return res.status(400).json({
//         error: "Aadhar number must be exactly 12 digits and numeric only"
//       });
//     }

//     // Validate required files
//     if (!req.files?.photo?.[0]) return res.status(400).json({ error: "Farmer photo is required" });

//     // Upload farmer photo to Cloudinary
//     console.log("☁️ Uploading farmer photo to Cloudinary...");
//     const photoUpload = await uploadToCloudinary(req.files.photo[0].buffer, {
//       folder: 'fish-farm/farmers',
//       public_id: `farmer_${Date.now()}`
//     });
//     console.log("✅ Farmer photo uploaded:", photoUpload.secure_url);

//     const totalPonds = parseInt(pondCount || 0);
//     const pondsArray = [];

//     // ✅ ADD LATITUDE/LONGITUDE VALIDATION
//     if (totalPonds > 0) {
//       for (let i = 1; i <= totalPonds; i++) {
//         if (!req.body[`latitude${i}`] || !req.body[`longitude${i}`]) {
//           return res.status(400).json({
//             error: `Latitude & Longitude required for pond ${i}`
//           });
//         }
        
//         const lat = Number(req.body[`latitude${i}`]);
//         const lng = Number(req.body[`longitude${i}`]);
        
//         if (isNaN(lat) || lat < -90 || lat > 90) {
//           return res.status(400).json({
//             error: `Invalid latitude for pond ${i}. Must be between -90 and 90`
//           });
//         }
        
//         if (isNaN(lng) || lng < -180 || lng > 180) {
//           return res.status(400).json({
//             error: `Invalid longitude for pond ${i}. Must be between -180 and 180`
//           });
//         }
//       }
//     }

//     // Create ponds if any
//     if (totalPonds > 0) {
//       // Upload pond image if provided
//       let pondImageUrl = null;
//       let pondImagePublicId = null;
//       if (req.files?.pondImage?.[0]) {
//         console.log("☁️ Uploading pond image to Cloudinary...");
//         const pondImageUpload = await uploadToCloudinary(req.files.pondImage[0].buffer, {
//           folder: 'fish-farm/ponds',
//           public_id: `pond_${Date.now()}`
//         });
//         pondImageUrl = pondImageUpload.secure_url;
//         pondImagePublicId = pondImageUpload.public_id;
//         console.log("✅ Pond image uploaded:", pondImageUrl);
//       }

//       // Upload pond files
//       const pondFileUrls = [];
//       const pondFilePublicIds = [];
//       if (req.files?.pondFiles) {
//         console.log(`☁️ Uploading ${req.files.pondFiles.length} pond files...`);
//         for (const file of req.files.pondFiles) {
//           const upload = await uploadToCloudinary(file.buffer, {
//             folder: 'fish-farm/pond-files',
//             resource_type: 'auto'
//           });
//           pondFileUrls.push(upload.secure_url);
//           pondFilePublicIds.push(upload.public_id);
//         }
//       }

//       // Upload fish files
//       const fishFileUrls = [];
//       const fishFilePublicIds = [];
//       if (req.files?.fishFiles) {
//         console.log(`☁️ Uploading ${req.files.fishFiles.length} fish files...`);
//         for (const file of req.files.fishFiles) {
//           const upload = await uploadToCloudinary(file.buffer, {
//             folder: 'fish-farm/fish-files',
//             resource_type: 'auto'
//           });
//           fishFileUrls.push(upload.secure_url);
//           fishFilePublicIds.push(upload.public_id);
//         }
//       }
      
//       for (let i = 1; i <= totalPonds; i++) {
//         const lat = parseFloat(req.body[`latitude${i}`]);
//         const lng = parseFloat(req.body[`longitude${i}`]);

//         if (Number.isNaN(lat) || Number.isNaN(lng)) {
//           return res.status(400).json({
//             error: `Invalid latitude/longitude for pond ${i}`
//           });
//         }

//         console.log("📍 Saving pond location:", lat, lng);
        
//         const pondData = {
//           pondId: `P${i}`,
//           pondNumber: i,
//           pondArea: req.body[`pondArea${i}`] || "",
//           pondAreaUnit: req.body[`pondAreaUnit${i}`] || "acre",
//           pondDepth: req.body[`pondDepth${i}`] || "",
//           pondImage: pondImageUrl,
//           pondImagePublicId: pondImagePublicId,
          
//           latitude: lat,
//           longitude: lng,
          
//           overflow: req.body[`overflow${i}`] || "No",
//           receivesSunlight: req.body[`receivesSunlight${i}`] || "Yes",
//           treesOnBanks: req.body[`treesOnBanks${i}`] || "No",
//           neighbourhood: req.body[`neighbourhood${i}`] || "Agriculture Farm",
//           wastewaterEnters: req.body[`wastewaterEnters${i}`] || "No",
          
//           species: req.body[`species${i}`] || "",
//           dateOfStocking: req.body[`dateOfStocking${i}`] || new Date(),
//           qtySeedInitially: req.body[`qtySeedInitially${i}`] || "",
//           currentQty: req.body[`currentQty${i}`] || "",
//           avgSize: req.body[`avgSize${i}`] || ">200gram",
          
//           feedType: req.body[`feedType${i}`] || "Market Feed",
//           feedOther: req.body[`feedOther${i}`] || "",
//           feedFreq: req.body[`feedFreq${i}`] || "Once a day",
//           feedQtyPerDay: req.body[`feedQtyPerDay${i}`] || "",
//           feedTime: req.body[`feedTime${i}`] || "6:00 am-10:00am",
//           recentFeedChanges: req.body[`recentFeedChanges${i}`] || "",
//           reducedAppetite: req.body[`reducedAppetite${i}`] || "No",
          
//           waterTemperature: req.body[`waterTemperature${i}`] || "",
//           pH: req.body[`pH${i}`] || "",
//           DO: req.body[`DO${i}`] || "",
//           ammoniaLevel: req.body[`ammoniaLevel${i}`] || "Medium",
//           phytoplanktonLevel: req.body[`phytoplanktonLevel${i}`] || "Medium",
//           waterHardness: req.body[`waterHardness${i}`] || "1",
//           algaeBloom: req.body[`algaeBloom${i}`] || "No",
//           pondWaterColor: req.body[`pondWaterColor${i}`] || "Light Green",
//           sourceOfWater: req.body[`sourceOfWater${i}`] || "Rainwater",
          
//           diseaseSymptoms: req.body[`diseaseSymptoms${i}`] || "No",
//           symptomsObserved: req.body[`symptomsObserved${i}`] || "",
//           fishDeaths: req.body[`fishDeaths${i}`] || "",
//           symptomsAffect: req.body[`symptomsAffect${i}`] || "All",
          
//           farmObservedDate: req.body[`farmObservedDate${i}`] || new Date(),
//           farmObservedTime: req.body[`farmObservedTime${i}`] || "",
          
//           lastSpecies: req.body[`lastSpecies${i}`] || "",
//           lastHarvestComplete: req.body[`lastHarvestComplete${i}`] || "Yes",
//           recentRainFlood: req.body[`recentRainFlood${i}`] || "No",
//           pesticideRunoff: req.body[`pesticideRunoff${i}`] || "No",
//           constructionNear: req.body[`constructionNear${i}`] || "No",
//           suddenTempChange: req.body[`suddenTempChange${i}`] || "No",
          
//           notes: req.body[`notes${i}`] || "",
          
//           pondFiles: pondFileUrls,
//           pondFilesPublicIds: pondFilePublicIds,
//           fishFiles: fishFileUrls,
//           fishFilesPublicIds: fishFilePublicIds,
          
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };
        
//         pondsArray.push(pondData);
//       }
//     }

//     // ✅ CREATE FARMER
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
//       photo: photoUpload.secure_url,
//       photoPublicId: photoUpload.public_id,
//       ponds: pondsArray,
//       updates: []
//     });

//     console.log("📋 Farmer object before save:", {
//       name: newFarmer.name,
//       pondCount: newFarmer.pondCount,
//       photo: newFarmer.photo ? 'URL present' : 'No photo',
//       pondsCount: newFarmer.ponds.length,
//     });

//     // Save farmer
//     await newFarmer.save();
//     console.log("✅ Farmer saved successfully. Auto-generated farmerId:", newFarmer.farmerId);
    
//     // Update pondIds if needed
//     if (newFarmer.farmerId && newFarmer.ponds.length > 0) {
//       newFarmer.ponds.forEach((pond, index) => {
//         pond.pondId = `${newFarmer.farmerId}-P${index + 1}`;
//       });
//       await newFarmer.save();
//     }
    
//     res.status(201).json(newFarmer);

//   } catch (err) {
//     console.error("🔥 ADD FARMER ERROR:", err);
//     res.status(500).json({ 
//       error: err.message,
//       details: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
//   }
// };

// // ---------------------------
// // GET FARMERS
// // ---------------------------
// export const getFarmers = async (req, res) => {
//   try {
//     const farmers = await Farmer.find({ createdBy: req.query.userId });
    
//     // Cloudinary URLs are already stored, no conversion needed
//     res.json(farmers);
//   } catch (err) {
//     console.error("🔥 GET FARMERS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---------------------------
// // GET FARMER BY ID
// // ---------------------------
// export const getFarmerById = async (req, res) => {
//   try {
//     const farmer = await Farmer.getFarmerByAnyId(req.params.id);
//     if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    
//     res.json(farmer);
//   } catch (err) {
//     console.error("🔥 GET FARMER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---------------------------
// // UPDATE FARMER (with Cloudinary)
// // ---------------------------
// export const updateFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) return res.status(404).json({ error: "Farmer not found" });

//     // 📞 Phone validation (if contact is being updated)
//     if (req.body.contact && !/^\d{10}$/.test(req.body.contact)) {
//       return res.status(400).json({
//         error: "Phone number must be exactly 10 digits and numeric only"
//       });
//     }

//     // 🆔 Aadhar validation (if adhar is being updated)
//     if (req.body.adhar && !/^\d{12}$/.test(req.body.adhar)) {
//       return res.status(400).json({
//         error: "Aadhar number must be exactly 12 digits and numeric only"
//       });
//     }

//     // Save old data for history
//     const oldFarmerData = farmer.toObject();

//     // Update fields
//     Object.keys(req.body).forEach(key => { 
//       if (req.body[key] !== undefined && 
//           !['farmerId', '_id', 'createdAt', 'updatedAt'].includes(key)) {
//         farmer[key] = req.body[key]; 
//       }
//     });

//     // Update photo if new one uploaded
//     if (req.files?.photo) {
//       // Delete old photo from Cloudinary
//       if (farmer.photoPublicId) {
//         await deleteFromCloudinary(farmer.photoPublicId);
//       }
      
//       // Upload new photo
//       const photoUpload = await uploadToCloudinary(req.files.photo[0].buffer, {
//         folder: 'fish-farm/farmers',
//         public_id: `farmer_${Date.now()}`
//       });
//       farmer.photo = photoUpload.secure_url;
//       farmer.photoPublicId = photoUpload.public_id;
//     }

//     // Track changes for history
//     const changes = {};
//     Object.keys(req.body).forEach(key => {
//       if (!['userId', 'farmerId'].includes(key) && 
//           oldFarmerData[key] != req.body[key]) {
//         changes[key] = {
//           old: oldFarmerData[key] || "N/A",
//           new: req.body[key]
//         };
//       }
//     });

//     // Add to updates history
//     if (Object.keys(changes).length > 0) {
//       farmer.updates.push({
//         snapshot: oldFarmerData,
//         changes,
//         updatedBy: req.body.userId || farmer.userId,
//         createdAt: new Date()
//       });
//     }

//     await farmer.save();
    
//     res.json(farmer);
//   } catch (err) {
//     console.error("🔥 UPDATE FARMER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---------------------------
// // ADD POND TO FARMER (with Cloudinary)
// // ---------------------------
// export const addPondToFarmer = async (req, res) => {
//   try {
//     const { farmerId } = req.params;
//     const pondData = req.body;

//     const farmer = await Farmer.getFarmerByAnyId(farmerId);
//     if (!farmer)
//       return res.status(404).json({ error: "Farmer not found" });

//     // ✅ VALIDATION
//     if (!pondData.latitude || !pondData.longitude) {
//       return res.status(400).json({
//         error: "Latitude & Longitude are required for pond"
//       });
//     }
    
//     const lat = parseFloat(pondData.latitude);
//     const lng = parseFloat(pondData.longitude);
    
//     if (Number.isNaN(lat) || lat < -90 || lat > 90) {
//       return res.status(400).json({
//         error: "Invalid latitude. Must be between -90 and 90"
//       });
//     }
    
//     if (Number.isNaN(lng) || lng < -180 || lng > 180) {
//       return res.status(400).json({
//         error: "Invalid longitude. Must be between -180 and 180"
//       });
//     }

//     const requiredPondFields = [
//       'pondArea', 'pondDepth', 'species', 'dateOfStocking', 
//       'qtySeedInitially', 'currentQty', 'waterTemperature', 'pH', 'DO',
//       'farmObservedDate', 'farmObservedTime'
//     ];
    
//     for (const field of requiredPondFields) {
//       if (!pondData[field]) {
//         return res.status(400).json({ 
//           error: `Please fill required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}` 
//         });
//       }
//     }

//     const pondNumber = farmer.ponds.length > 0 
//       ? Math.max(...farmer.ponds.map(p => p.pondNumber)) + 1 
//       : 1;
    
//     const newPondId = `${farmer.farmerId}-P${pondNumber}`;

//     // Upload pond image if provided
//     let pondImageUrl = null;
//     let pondImagePublicId = null;
//     if (req.files?.pondImage?.[0]) {
//       const pondImageUpload = await uploadToCloudinary(req.files.pondImage[0].buffer, {
//         folder: 'fish-farm/ponds',
//         public_id: `pond_${Date.now()}`
//       });
//       pondImageUrl = pondImageUpload.secure_url;
//       pondImagePublicId = pondImageUpload.public_id;
//     }

//     // Upload selfie if provided
//     let selfieUrl = null;
//     let selfiePublicId = null;
//     if (req.files?.uploadSelfie?.[0]) {
//       const selfieUpload = await uploadToCloudinary(req.files.uploadSelfie[0].buffer, {
//         folder: 'fish-farm/selfies',
//         public_id: `selfie_${Date.now()}`
//       });
//       selfieUrl = selfieUpload.secure_url;
//       selfiePublicId = selfieUpload.public_id;
//     }

//     // Upload pond files
//     const pondFileUrls = [];
//     const pondFilePublicIds = [];
//     if (req.files?.pondFiles) {
//       for (const file of req.files.pondFiles) {
//         const upload = await uploadToCloudinary(file.buffer, {
//           folder: 'fish-farm/pond-files',
//           resource_type: 'auto'
//         });
//         pondFileUrls.push(upload.secure_url);
//         pondFilePublicIds.push(upload.public_id);
//       }
//     }

//     // Upload fish files
//     const fishFileUrls = [];
//     const fishFilePublicIds = [];
//     if (req.files?.fishFiles) {
//       for (const file of req.files.fishFiles) {
//         const upload = await uploadToCloudinary(file.buffer, {
//           folder: 'fish-farm/fish-files',
//           resource_type: 'auto'
//         });
//         fishFileUrls.push(upload.secure_url);
//         fishFilePublicIds.push(upload.public_id);
//       }
//     }

//     // Date parsing
//     if (pondData.dateOfStocking) {
//       pondData.dateOfStocking = new Date(pondData.dateOfStocking);
//     }
//     if (pondData.farmObservedDate) {
//       pondData.farmObservedDate = new Date(pondData.farmObservedDate);
//     }

//     const newPond = {
//       pondId: newPondId,
//       pondNumber,
      
//       ...pondData,
      
//       latitude: lat,
//       longitude: lng,
      
//       pondImage: pondImageUrl,
//       pondImagePublicId: pondImagePublicId,
      
//       uploadSelfie: selfieUrl,
//       uploadSelfiePublicId: selfiePublicId,
      
//       pondFiles: pondFileUrls,
//       pondFilesPublicIds: pondFilePublicIds,
//       fishFiles: fishFileUrls,
//       fishFilesPublicIds: fishFilePublicIds,
      
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     farmer.ponds.push(newPond);
//     farmer.pondCount = farmer.ponds.length;

//     await farmer.save();

//     res.json({ success: true, farmer });
//   } catch (err) {
//     console.error("ADD POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---------------------------
// // UPDATE POND (with Cloudinary)
// // ---------------------------
// export const updatePond = async (req, res) => {
//   try {
//     const { farmerId, pondId } = req.params;
//     const updateData = req.body;

//     const farmer = await Farmer.getFarmerByAnyId(farmerId);
//     if (!farmer)
//       return res.status(404).json({ error: "Farmer not found" });

//     const pondIndex = farmer.ponds.findIndex(
//       p => p.pondId === pondId
//     );
    
//     if (pondIndex === -1)
//       return res.status(404).json({ error: "Pond not found" });

//     // ✅ VALIDATE LATITUDE/LONGITUDE
//     if (updateData.latitude !== undefined || updateData.longitude !== undefined) {
//       const lat = updateData.latitude !== undefined ? parseFloat(updateData.latitude) : farmer.ponds[pondIndex].latitude;
//       const lng = updateData.longitude !== undefined ? parseFloat(updateData.longitude) : farmer.ponds[pondIndex].longitude;
      
//       if (updateData.latitude !== undefined && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
//         return res.status(400).json({
//           error: "Invalid latitude. Must be between -90 and 90"
//         });
//       }
      
//       if (updateData.longitude !== undefined && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
//         return res.status(400).json({
//           error: "Invalid longitude. Must be between -180 and 180"
//         });
//       }
//     }

//     // Date parsing
//     if (updateData.dateOfStocking) {
//       updateData.dateOfStocking = new Date(updateData.dateOfStocking);
//     }
//     if (updateData.farmObservedDate) {
//       updateData.farmObservedDate = new Date(updateData.farmObservedDate);
//     }

//     // Save history
//     const oldPond = JSON.parse(JSON.stringify(farmer.ponds[pondIndex]));
//     const changes = {};

//     Object.keys(updateData).forEach(key => {
//       if (oldPond[key] != updateData[key]) {
//         changes[`pond.${key}`] = {
//           old: oldPond[key] || "N/A",
//           new: updateData[key]
//         };
//       }
//     });

//     // Handle file updates
//     let pondImageUrl = oldPond.pondImage;
//     let pondImagePublicId = oldPond.pondImagePublicId;
//     if (req.files?.pondImage?.[0]) {
//       // Delete old image
//       if (oldPond.pondImagePublicId) {
//         await deleteFromCloudinary(oldPond.pondImagePublicId);
//       }
      
//       const pondImageUpload = await uploadToCloudinary(req.files.pondImage[0].buffer, {
//         folder: 'fish-farm/ponds',
//         public_id: `pond_${Date.now()}`
//       });
//       pondImageUrl = pondImageUpload.secure_url;
//       pondImagePublicId = pondImageUpload.public_id;
//       changes['pond.pondImage'] = { old: 'Previous image', new: 'New image uploaded' };
//     }

//     let selfieUrl = oldPond.uploadSelfie;
//     let selfiePublicId = oldPond.uploadSelfiePublicId;
//     if (req.files?.uploadSelfie?.[0]) {
//       // Delete old selfie
//       if (oldPond.uploadSelfiePublicId) {
//         await deleteFromCloudinary(oldPond.uploadSelfiePublicId);
//       }
      
//       const selfieUpload = await uploadToCloudinary(req.files.uploadSelfie[0].buffer, {
//         folder: 'fish-farm/selfies',
//         public_id: `selfie_${Date.now()}`
//       });
//       selfieUrl = selfieUpload.secure_url;
//       selfiePublicId = selfieUpload.public_id;
//       changes['pond.uploadSelfie'] = { old: 'Previous selfie', new: 'New selfie uploaded' };
//     }

//     // Handle additional files
//     const pondFileUrls = oldPond.pondFiles || [];
//     const pondFilePublicIds = oldPond.pondFilesPublicIds || [];
//     if (req.files?.pondFiles) {
//       for (const file of req.files.pondFiles) {
//         const upload = await uploadToCloudinary(file.buffer, {
//           folder: 'fish-farm/pond-files',
//           resource_type: 'auto'
//         });
//         pondFileUrls.push(upload.secure_url);
//         pondFilePublicIds.push(upload.public_id);
//       }
//       changes['pond.pondFiles'] = { old: `${oldPond.pondFiles?.length || 0} files`, new: `${pondFileUrls.length} files` };
//     }

//     const fishFileUrls = oldPond.fishFiles || [];
//     const fishFilePublicIds = oldPond.fishFilesPublicIds || [];
//     if (req.files?.fishFiles) {
//       for (const file of req.files.fishFiles) {
//         const upload = await uploadToCloudinary(file.buffer, {
//           folder: 'fish-farm/fish-files',
//           resource_type: 'auto'
//         });
//         fishFileUrls.push(upload.secure_url);
//         fishFilePublicIds.push(upload.public_id);
//       }
//       changes['pond.fishFiles'] = { old: `${oldPond.fishFiles?.length || 0} files`, new: `${fishFileUrls.length} files` };
//     }

//     if (Object.keys(changes).length > 0) {
//       farmer.updates.push({
//         snapshot: {
//           pondId: oldPond.pondId,
//           pondNumber: oldPond.pondNumber,
//           ...oldPond
//         },
//         changes,
//         updatedBy: updateData.userId || farmer.userId,
//         createdAt: new Date()
//       });
//     }

//     // Update pond
//     farmer.ponds[pondIndex] = {
//       ...oldPond,

//       pondId: oldPond.pondId,
//       pondNumber: oldPond.pondNumber,

//       ...updateData,

//       latitude: updateData.latitude !== undefined ? parseFloat(updateData.latitude) : oldPond.latitude,
//       longitude: updateData.longitude !== undefined ? parseFloat(updateData.longitude) : oldPond.longitude,

//       pondImage: pondImageUrl,
//       pondImagePublicId: pondImagePublicId,
      
//       uploadSelfie: selfieUrl,
//       uploadSelfiePublicId: selfiePublicId,

//       pondFiles: pondFileUrls,
//       pondFilesPublicIds: pondFilePublicIds,
//       fishFiles: fishFileUrls,
//       fishFilesPublicIds: fishFilePublicIds,

//       updatedAt: new Date()
//     };

//     await farmer.save();

//     res.json({ success: true, farmer });
//   } catch (err) {
//     console.error("UPDATE POND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---------------------------
// // DELETE FARMER (with Cloudinary cleanup)
// // ---------------------------
// export const deleteFarmer = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) return res.status(404).json({ error: "Farmer not found" });

//     // Delete farmer photo
//     if (farmer.photoPublicId) {
//       await deleteFromCloudinary(farmer.photoPublicId);
//     }

//     // Delete all pond images and files
//     for (const pond of farmer.ponds) {
//       if (pond.pondImagePublicId) {
//         await deleteFromCloudinary(pond.pondImagePublicId);
//       }
//       if (pond.uploadSelfiePublicId) {
//         await deleteFromCloudinary(pond.uploadSelfiePublicId);
//       }
      
//       for (const publicId of pond.pondFilesPublicIds || []) {
//         await deleteFromCloudinary(publicId);
//       }
//       for (const publicId of pond.fishFilesPublicIds || []) {
//         await deleteFromCloudinary(publicId);
//       }
//     }

//     // Delete global files
//     for (const publicId of farmer.pondFilesPublicIds || []) {
//       await deleteFromCloudinary(publicId);
//     }
//     for (const publicId of farmer.fishFilesPublicIds || []) {
//       await deleteFromCloudinary(publicId);
//     }

//     await Farmer.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Farmer deleted successfully" });
//   } catch (err) {
//     console.error("DELETE FARMER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };








//ye sahi hai 















import mongoose from "mongoose";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import AccessRequest from "../models/accessRequestModel.js";
import Farmer from "../models/farmerModel.js";

// ---------------------------
// GET FARMERS BY AGENT
// ---------------------------
export const getFarmersByAgent = async (req, res) => {
  try {
    const { agentId, viewerId } = req.query;
    const allFarmers = await Farmer.find({ createdBy: agentId })
      .select("name contact village photo _id farmerId")
      .sort({ name: 1 });

    // Cloudinary URLs are already stored, no need to convert
    const farmersWithAccess = await Promise.all(
      allFarmers.map(async (farmer) => {
        const farmerObj = farmer.toObject();
        const access = await AccessRequest.findOne({
          requesterId: viewerId,
          targetFarmerId: farmer._id,
          status: "approved",
        });

        return {
          ...farmerObj,
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
// ADD FARMER (with Cloudinary)
// ---------------------------
export const addFarmer = async (req, res) => {
  try {
    console.log("📝 ADD FARMER REQUEST BODY:", req.body);
    console.log("📸 FILES:", req.files);

    const { name, contact, age, gender, village, pondCount, adhar, familyMembers, familyOccupation, userId } = req.body;

    // Validation - Aadhar is now optional
    const requiredFields = ['name','contact','age','gender','village','familyMembers','familyOccupation', 'userId'];
    const missingFields = requiredFields.filter(f => !req.body[f]);
    if (missingFields.length) return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });

    // 📞 Phone validation
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({
        error: "Phone number must be exactly 10 digits and numeric only"
      });
    }

    // 🆔 Aadhar validation (only if provided)
    if (adhar && !/^\d{12}$/.test(adhar)) {
      return res.status(400).json({
        error: "Aadhar number must be exactly 12 digits and numeric only"
      });
    }

    // Validate required files
    if (!req.files?.photo?.[0]) return res.status(400).json({ error: "Farmer photo is required" });

    // Upload farmer photo to Cloudinary
    console.log("☁️ Uploading farmer photo to Cloudinary...");
    const photoUpload = await uploadToCloudinary(req.files.photo[0].buffer, {
      folder: 'fish-farm/farmers',
      public_id: `farmer_${Date.now()}`
    });
    console.log("✅ Farmer photo uploaded:", photoUpload.secure_url);

    const totalPonds = parseInt(pondCount || 0);
    const pondsArray = [];

    // ✅ ADD LATITUDE/LONGITUDE VALIDATION
    if (totalPonds > 0) {
      for (let i = 1; i <= totalPonds; i++) {
        if (!req.body[`latitude${i}`] || !req.body[`longitude${i}`]) {
          return res.status(400).json({
            error: `Latitude & Longitude required for pond ${i}`
          });
        }
        
        const lat = Number(req.body[`latitude${i}`]);
        const lng = Number(req.body[`longitude${i}`]);
        
        if (isNaN(lat) || lat < -90 || lat > 90) {
          return res.status(400).json({
            error: `Invalid latitude for pond ${i}. Must be between -90 and 90`
          });
        }
        
        if (isNaN(lng) || lng < -180 || lng > 180) {
          return res.status(400).json({
            error: `Invalid longitude for pond ${i}. Must be between -180 and 180`
          });
        }
      }
    }

    // Create ponds if any
    if (totalPonds > 0) {
      // Upload pond image if provided
      let pondImageUrl = null;
      let pondImagePublicId = null;
      if (req.files?.pondImage?.[0]) {
        console.log("☁️ Uploading pond image to Cloudinary...");
        const pondImageUpload = await uploadToCloudinary(req.files.pondImage[0].buffer, {
          folder: 'fish-farm/ponds',
          public_id: `pond_${Date.now()}`
        });
        pondImageUrl = pondImageUpload.secure_url;
        pondImagePublicId = pondImageUpload.public_id;
        console.log("✅ Pond image uploaded:", pondImageUrl);
      }

      // Upload pond files
      const pondFileUrls = [];
      const pondFilePublicIds = [];
      if (req.files?.pondFiles) {
        console.log(`☁️ Uploading ${req.files.pondFiles.length} pond files...`);
        for (const file of req.files.pondFiles) {
          const upload = await uploadToCloudinary(file.buffer, {
            folder: 'fish-farm/pond-files',
            resource_type: 'auto'
          });
          pondFileUrls.push(upload.secure_url);
          pondFilePublicIds.push(upload.public_id);
        }
      }

      // Upload fish files
      const fishFileUrls = [];
      const fishFilePublicIds = [];
      if (req.files?.fishFiles) {
        console.log(`☁️ Uploading ${req.files.fishFiles.length} fish files...`);
        for (const file of req.files.fishFiles) {
          const upload = await uploadToCloudinary(file.buffer, {
            folder: 'fish-farm/fish-files',
            resource_type: 'auto'
          });
          fishFileUrls.push(upload.secure_url);
          fishFilePublicIds.push(upload.public_id);
        }
      }
      
      for (let i = 1; i <= totalPonds; i++) {
        const lat = parseFloat(req.body[`latitude${i}`]);
        const lng = parseFloat(req.body[`longitude${i}`]);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          return res.status(400).json({
            error: `Invalid latitude/longitude for pond ${i}`
          });
        }

        console.log("📍 Saving pond location:", lat, lng);
        
        const pondData = {
          pondId: `P${i}`,
          pondNumber: i,
          pondArea: req.body[`pondArea${i}`] || "",
          pondAreaUnit: req.body[`pondAreaUnit${i}`] || "acre",
          pondDepth: req.body[`pondDepth${i}`] || "",
          pondImage: pondImageUrl,
          pondImagePublicId: pondImagePublicId,
          
          latitude: lat,
          longitude: lng,
          
          overflow: req.body[`overflow${i}`] || "No",
          receivesSunlight: req.body[`receivesSunlight${i}`] || "Yes",
          treesOnBanks: req.body[`treesOnBanks${i}`] || "No",
          neighbourhood: req.body[`neighbourhood${i}`] || "Agriculture Farm",
          wastewaterEnters: req.body[`wastewaterEnters${i}`] || "No",
          
          species: req.body[`species${i}`] || "",
          dateOfStocking: req.body[`dateOfStocking${i}`] || new Date(),
          qtySeedInitially: req.body[`qtySeedInitially${i}`] || "",
          currentQty: req.body[`currentQty${i}`] || "",
          avgSize: req.body[`avgSize${i}`] || "<200gram",
          
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
          
          pondFiles: pondFileUrls,
          pondFilesPublicIds: pondFilePublicIds,
          fishFiles: fishFileUrls,
          fishFilesPublicIds: fishFilePublicIds,
          
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        pondsArray.push(pondData);
      }
    }

    // ✅ CREATE FARMER - Aadhar is now optional
    const newFarmer = new Farmer({
      userId,
      createdBy: userId,
      name, 
      contact, 
      age, 
      gender, 
      village,
      pondCount: totalPonds,
      adhar: adhar || "", // Set to empty string if not provided
      familyMembers, 
      familyOccupation,
      photo: photoUpload.secure_url,
      photoPublicId: photoUpload.public_id,
      ponds: pondsArray,
      updates: []
    });

    console.log("📋 Farmer object before save:", {
      name: newFarmer.name,
      pondCount: newFarmer.pondCount,
      photo: newFarmer.photo ? 'URL present' : 'No photo',
      pondsCount: newFarmer.ponds.length,
      adharProvided: !!adhar
    });

    // Save farmer
    await newFarmer.save();
    console.log("✅ Farmer saved successfully. Auto-generated farmerId:", newFarmer.farmerId);
    
    // Update pondIds if needed
    if (newFarmer.farmerId && newFarmer.ponds.length > 0) {
      newFarmer.ponds.forEach((pond, index) => {
        pond.pondId = `${newFarmer.farmerId}-P${index + 1}`;
      });
      await newFarmer.save();
    }
    
    res.status(201).json(newFarmer);

  } catch (err) {
    console.error("🔥 ADD FARMER ERROR:", err);
    res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// ---------------------------
// GET FARMERS - FIXED VERSION
// ---------------------------
export const getFarmers = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    console.log("Fetching farmers for userId:", userId);
    console.log("userId length:", userId.length);
    
    let farmers = [];
    
    // Try to find by string ID first (in case userId is stored as string)
    farmers = await Farmer.find({ createdBy: userId });
    
    // If no farmers found and userId might be a valid ObjectId, try that too
    if (farmers.length === 0 && mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Trying to find by ObjectId");
      farmers = await Farmer.find({ createdBy: new mongoose.Types.ObjectId(userId) });
    }
    
    console.log(`Found ${farmers.length} farmers for user ${userId}`);
    
    res.json(farmers);
  } catch (err) {
    console.error("🔥 GET FARMERS ERROR:", err);
    res.status(500).json({ 
      error: err.message
    });
  }
};

// ---------------------------
// GET FARMER BY ID
// ---------------------------
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.getFarmerByAnyId(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    
    res.json(farmer);
  } catch (err) {
    console.error("🔥 GET FARMER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// UPDATE FARMER (with Cloudinary)
// ---------------------------
export const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    // 📞 Phone validation (if contact is being updated)
    if (req.body.contact && !/^\d{10}$/.test(req.body.contact)) {
      return res.status(400).json({
        error: "Phone number must be exactly 10 digits and numeric only"
      });
    }

    // 🆔 Aadhar validation (only if provided and not empty)
    if (req.body.adhar && req.body.adhar !== "" && !/^\d{12}$/.test(req.body.adhar)) {
      return res.status(400).json({
        error: "Aadhar number must be exactly 12 digits and numeric only"
      });
    }

    // Save old data for history
    const oldFarmerData = farmer.toObject();

    // Update fields
    Object.keys(req.body).forEach(key => { 
      if (req.body[key] !== undefined && 
          !['farmerId', '_id', 'createdAt', 'updatedAt'].includes(key)) {
        farmer[key] = req.body[key]; 
      }
    });

    // Update photo if new one uploaded
    if (req.files?.photo) {
      // Delete old photo from Cloudinary
      if (farmer.photoPublicId) {
        await deleteFromCloudinary(farmer.photoPublicId);
      }
      
      // Upload new photo
      const photoUpload = await uploadToCloudinary(req.files.photo[0].buffer, {
        folder: 'fish-farm/farmers',
        public_id: `farmer_${Date.now()}`
      });
      farmer.photo = photoUpload.secure_url;
      farmer.photoPublicId = photoUpload.public_id;
    }

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
        updatedBy: req.body.userId || farmer.userId,
        createdAt: new Date()
      });
    }

    await farmer.save();
    
    res.json(farmer);
  } catch (err) {
    console.error("🔥 UPDATE FARMER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// ADD POND TO FARMER (with Cloudinary)
// ---------------------------
export const addPondToFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const pondData = req.body;

    const farmer = await Farmer.getFarmerByAnyId(farmerId);
    if (!farmer)
      return res.status(404).json({ error: "Farmer not found" });

    // ✅ VALIDATION
    if (!pondData.latitude || !pondData.longitude) {
      return res.status(400).json({
        error: "Latitude & Longitude are required for pond"
      });
    }
    
    const lat = parseFloat(pondData.latitude);
    const lng = parseFloat(pondData.longitude);
    
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({
        error: "Invalid latitude. Must be between -90 and 90"
      });
    }
    
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        error: "Invalid longitude. Must be between -180 and 180"
      });
    }

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

    // Upload pond image if provided
    let pondImageUrl = null;
    let pondImagePublicId = null;
    if (req.files?.pondImage?.[0]) {
      const pondImageUpload = await uploadToCloudinary(req.files.pondImage[0].buffer, {
        folder: 'fish-farm/ponds',
        public_id: `pond_${Date.now()}`
      });
      pondImageUrl = pondImageUpload.secure_url;
      pondImagePublicId = pondImageUpload.public_id;
    }

    // Upload selfie if provided
    let selfieUrl = null;
    let selfiePublicId = null;
    if (req.files?.uploadSelfie?.[0]) {
      const selfieUpload = await uploadToCloudinary(req.files.uploadSelfie[0].buffer, {
        folder: 'fish-farm/selfies',
        public_id: `selfie_${Date.now()}`
      });
      selfieUrl = selfieUpload.secure_url;
      selfiePublicId = selfieUpload.public_id;
    }

    // Upload pond files
    const pondFileUrls = [];
    const pondFilePublicIds = [];
    if (req.files?.pondFiles) {
      for (const file of req.files.pondFiles) {
        const upload = await uploadToCloudinary(file.buffer, {
          folder: 'fish-farm/pond-files',
          resource_type: 'auto'
        });
        pondFileUrls.push(upload.secure_url);
        pondFilePublicIds.push(upload.public_id);
      }
    }

    // Upload fish files
    const fishFileUrls = [];
    const fishFilePublicIds = [];
    if (req.files?.fishFiles) {
      for (const file of req.files.fishFiles) {
        const upload = await uploadToCloudinary(file.buffer, {
          folder: 'fish-farm/fish-files',
          resource_type: 'auto'
        });
        fishFileUrls.push(upload.secure_url);
        fishFilePublicIds.push(upload.public_id);
      }
    }

    // Date parsing
    if (pondData.dateOfStocking) {
      pondData.dateOfStocking = new Date(pondData.dateOfStocking);
    }
    if (pondData.farmObservedDate) {
      pondData.farmObservedDate = new Date(pondData.farmObservedDate);
    }

    const newPond = {
      pondId: newPondId,
      pondNumber,
      
      ...pondData,
      
      latitude: lat,
      longitude: lng,
      
      pondImage: pondImageUrl,
      pondImagePublicId: pondImagePublicId,
      
      uploadSelfie: selfieUrl,
      uploadSelfiePublicId: selfiePublicId,
      
      pondFiles: pondFileUrls,
      pondFilesPublicIds: pondFilePublicIds,
      fishFiles: fishFileUrls,
      fishFilesPublicIds: fishFilePublicIds,
      
      createdAt: new Date(),
      updatedAt: new Date()
    };

    farmer.ponds.push(newPond);
    farmer.pondCount = farmer.ponds.length;

    await farmer.save();

    res.json({ success: true, farmer });
  } catch (err) {
    console.error("ADD POND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// UPDATE POND (with Cloudinary)
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

    // ✅ VALIDATE LATITUDE/LONGITUDE
    if (updateData.latitude !== undefined || updateData.longitude !== undefined) {
      const lat = updateData.latitude !== undefined ? parseFloat(updateData.latitude) : farmer.ponds[pondIndex].latitude;
      const lng = updateData.longitude !== undefined ? parseFloat(updateData.longitude) : farmer.ponds[pondIndex].longitude;
      
      if (updateData.latitude !== undefined && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
        return res.status(400).json({
          error: "Invalid latitude. Must be between -90 and 90"
        });
      }
      
      if (updateData.longitude !== undefined && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
        return res.status(400).json({
          error: "Invalid longitude. Must be between -180 and 180"
        });
      }
    }

    // Date parsing
    if (updateData.dateOfStocking) {
      updateData.dateOfStocking = new Date(updateData.dateOfStocking);
    }
    if (updateData.farmObservedDate) {
      updateData.farmObservedDate = new Date(updateData.farmObservedDate);
    }

    // Save history
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

    // Handle file updates
    let pondImageUrl = oldPond.pondImage;
    let pondImagePublicId = oldPond.pondImagePublicId;
    if (req.files?.pondImage?.[0]) {
      // Delete old image
      if (oldPond.pondImagePublicId) {
        await deleteFromCloudinary(oldPond.pondImagePublicId);
      }
      
      const pondImageUpload = await uploadToCloudinary(req.files.pondImage[0].buffer, {
        folder: 'fish-farm/ponds',
        public_id: `pond_${Date.now()}`
      });
      pondImageUrl = pondImageUpload.secure_url;
      pondImagePublicId = pondImageUpload.public_id;
      changes['pond.pondImage'] = { old: 'Previous image', new: 'New image uploaded' };
    }

    let selfieUrl = oldPond.uploadSelfie;
    let selfiePublicId = oldPond.uploadSelfiePublicId;
    if (req.files?.uploadSelfie?.[0]) {
      // Delete old selfie
      if (oldPond.uploadSelfiePublicId) {
        await deleteFromCloudinary(oldPond.uploadSelfiePublicId);
      }
      
      const selfieUpload = await uploadToCloudinary(req.files.uploadSelfie[0].buffer, {
        folder: 'fish-farm/selfies',
        public_id: `selfie_${Date.now()}`
      });
      selfieUrl = selfieUpload.secure_url;
      selfiePublicId = selfieUpload.public_id;
      changes['pond.uploadSelfie'] = { old: 'Previous selfie', new: 'New selfie uploaded' };
    }

    // Handle additional files
    const pondFileUrls = oldPond.pondFiles || [];
    const pondFilePublicIds = oldPond.pondFilesPublicIds || [];
    if (req.files?.pondFiles) {
      for (const file of req.files.pondFiles) {
        const upload = await uploadToCloudinary(file.buffer, {
          folder: 'fish-farm/pond-files',
          resource_type: 'auto'
        });
        pondFileUrls.push(upload.secure_url);
        pondFilePublicIds.push(upload.public_id);
      }
      changes['pond.pondFiles'] = { old: `${oldPond.pondFiles?.length || 0} files`, new: `${pondFileUrls.length} files` };
    }

    const fishFileUrls = oldPond.fishFiles || [];
    const fishFilePublicIds = oldPond.fishFilesPublicIds || [];
    if (req.files?.fishFiles) {
      for (const file of req.files.fishFiles) {
        const upload = await uploadToCloudinary(file.buffer, {
          folder: 'fish-farm/fish-files',
          resource_type: 'auto'
        });
        fishFileUrls.push(upload.secure_url);
        fishFilePublicIds.push(upload.public_id);
      }
      changes['pond.fishFiles'] = { old: `${oldPond.fishFiles?.length || 0} files`, new: `${fishFileUrls.length} files` };
    }

    if (Object.keys(changes).length > 0) {
      farmer.updates.push({
        snapshot: {
          pondId: oldPond.pondId,
          pondNumber: oldPond.pondNumber,
          ...oldPond
        },
        changes,
        updatedBy: updateData.userId || farmer.userId,
        createdAt: new Date()
      });
    }

    // Update pond
    farmer.ponds[pondIndex] = {
      ...oldPond,

      pondId: oldPond.pondId,
      pondNumber: oldPond.pondNumber,

      ...updateData,

      latitude: updateData.latitude !== undefined ? parseFloat(updateData.latitude) : oldPond.latitude,
      longitude: updateData.longitude !== undefined ? parseFloat(updateData.longitude) : oldPond.longitude,

      pondImage: pondImageUrl,
      pondImagePublicId: pondImagePublicId,
      
      uploadSelfie: selfieUrl,
      uploadSelfiePublicId: selfiePublicId,

      pondFiles: pondFileUrls,
      pondFilesPublicIds: pondFilePublicIds,
      fishFiles: fishFileUrls,
      fishFilesPublicIds: fishFilePublicIds,

      updatedAt: new Date()
    };

    await farmer.save();

    res.json({ success: true, farmer });
  } catch (err) {
    console.error("UPDATE POND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// DELETE FARMER (with Cloudinary cleanup)
// ---------------------------
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    // Delete farmer photo
    if (farmer.photoPublicId) {
      await deleteFromCloudinary(farmer.photoPublicId);
    }

    // Delete all pond images and files
    for (const pond of farmer.ponds) {
      if (pond.pondImagePublicId) {
        await deleteFromCloudinary(pond.pondImagePublicId);
      }
      if (pond.uploadSelfiePublicId) {
        await deleteFromCloudinary(pond.uploadSelfiePublicId);
      }
      
      for (const publicId of pond.pondFilesPublicIds || []) {
        await deleteFromCloudinary(publicId);
      }
      for (const publicId of pond.fishFilesPublicIds || []) {
        await deleteFromCloudinary(publicId);
      }
    }

    // Delete global files
    for (const publicId of farmer.pondFilesPublicIds || []) {
      await deleteFromCloudinary(publicId);
    }
    for (const publicId of farmer.fishFilesPublicIds || []) {
      await deleteFromCloudinary(publicId);
    }

    await Farmer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Farmer deleted successfully" });
  } catch (err) {
    console.error("DELETE FARMER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};