




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
















import Farmer from "../models/farmerModel.js";
import AccessRequest from "../models/accessRequestModel.js";

// ----------------------------------------------------
// 1️⃣ GET FARMERS BY AGENT (With Access Control)
// ----------------------------------------------------
export const getFarmersByAgent = async (req, res) => {
  try {
    const { agentId, viewerId } = req.query;

    const allFarmers = await Farmer.find({ createdBy: agentId })
      .select("name contact village _id")
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
          return { ...fullFarmer.toObject(), accessApproved: true };
        }

        return {
          _id: farmer._id,
          name: farmer.name,
          contact: farmer.contact,
          village: farmer.village,
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
    // FILES
    // -----------------------------
    const photo = req.files?.photo?.[0]
      ? `uploads/${req.files.photo[0].filename}`
      : "";

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

    res.status(200).json(farmers);

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
    res.json(farmer);
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
// 6️⃣ UPDATE FARMER (WITH VALIDATION)
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

    // 🔒 SAFE PHOTO UPDATE
    if (req.files?.photo?.[0]) {
      farmer.photo = `uploads/${req.files.photo[0].filename}`;
    }

    // Other files
    if (req.files?.pondImage)
      farmer.pondImage = req.files.pondImage[0].filename;

    if (req.files?.pondFiles)
      farmer.pondFiles.push(...req.files.pondFiles.map(f => f.filename));

    if (req.files?.fishFiles)
      farmer.fishFiles.push(...req.files.fishFiles.map(f => f.filename));

    await farmer.save();
    res.status(200).json(farmer);

  } catch (err) {
    console.error("🔥 UPDATE FARMER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};














