


// import Dealer from "../models/dealerModel.js";

// // ⭐ GET DEALERS (ADMIN = ALL | USER = ONLY HIS)
// export const getDealers = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     let dealers;

//     if (userId) {
//       // 🔹 Normal user → only his dealers
//       dealers = await Dealer.find({ createdBy: userId })
//         .sort({ createdAt: -1 });
//     } else {
//       // 🔹 Admin → all dealers
//       dealers = await Dealer.find()
//         .sort({ createdAt: -1 });
//     }

//     res.status(200).json(dealers);
//   } catch (err) {
//     console.error("Error fetching dealers:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ⭐ GET SINGLE DEALER BY ID
// export const getDealerById = async (req, res) => {
//   try {
//     const dealer = await Dealer.findById(req.params.id);
//     if (!dealer) {
//       return res.status(404).json({ error: "Dealer not found" });
//     }
//     res.status(200).json(dealer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ⭐ ADD DEALER
// export const addDealer = async (req, res) => {
//   try {
//     const { name, contact, gstNumber, shopAddress, userId } = req.body;

//     //  const imagePath = req.file ? req.file.filename : "";
//        const imagePath = req.file ? `uploads/${req.file.filename}` : "";

//     const dealer = new Dealer({
//       name,
//       contact,
//       gstNumber,
//       shopAddress,
//       image: imagePath,
//       createdBy: userId
//     });

//     await dealer.save();
//     res.status(201).json(dealer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ⭐ UPDATE DEALER (With History Backup)
// export const updateDealer = async (req, res) => {
//   try {
//     const dealer = await Dealer.findById(req.params.id);
//     if (!dealer) {
//       return res.status(404).json({ error: "Dealer not found" });
//     }

//     // ⭐ Backup old data
//     const oldSnapshot = dealer.toObject();
//     const changes = {};

//     Object.keys(req.body).forEach((key) => {
//       if (key !== "userId") {
//         if (dealer[key] !== req.body[key]) {
//           changes[key] = {
//             old: dealer[key],
//             new: req.body[key]
//           };
//         }
//       }
//     });

//     dealer.updates.push({
//       snapshot: oldSnapshot,
//       changes,
//       image: dealer.image,
//       createdAt: new Date()
//     });

//     // ⭐ Update fields
//     Object.keys(req.body).forEach((key) => {
//       dealer[key] = req.body[key];
//     });

//     // if (req.file) {
//     //   dealer.image = req.file.filename;
//     // }
    
//     if (req.file) {
//   dealer.image = `uploads/${req.file.filename}`;
// }


//     await dealer.save();
//     res.status(200).json(dealer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


















//buffer


import Dealer from "../models/dealerModel.js";

// ⭐ GET DEALERS
export const getDealers = async (req, res) => {
  try {
    const { userId } = req.query;

    const dealers = userId
      ? await Dealer.find({ createdBy: userId }).sort({ createdAt: -1 })
      : await Dealer.find().sort({ createdAt: -1 });

    res.status(200).json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ GET DEALER BY ID
export const getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) return res.status(404).json({ error: "Dealer not found" });
    res.status(200).json(dealer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ ADD DEALER
export const addDealer = async (req, res) => {
  try {
    const { name, contact, gstNumber, shopAddress, userId } = req.body;

    // Validate required fields
    if (!name || !contact || !gstNumber || !shopAddress) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    // Create new dealer
    const dealer = new Dealer({
      name,
      contact,
      gstNumber,
      shopAddress,
      createdBy: userId,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await dealer.save();
    
    // Return without the image buffer to reduce response size
    const dealerResponse = dealer.toObject();
    delete dealerResponse.image;
    
    res.status(201).json({
      ...dealerResponse,
      message: "Dealer added successfully"
    });

  } catch (err) {
    console.error("ADD DEALER ERROR:", err);
    
    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Duplicate field value entered" 
      });
    }
    
    res.status(500).json({ 
      error: err.message || "Server error occurred" 
    });
  }
};

// ⭐ UPDATE DEALER (WITH HISTORY)
export const updateDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, gstNumber, shopAddress, userId } = req.body;

    // Find dealer
    const dealer = await Dealer.findById(id);
    if (!dealer) {
      return res.status(404).json({ error: "Dealer not found" });
    }

    // Verify ownership (optional security check)
    if (userId && dealer.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this dealer" });
    }

    const oldSnapshot = dealer.toObject();
    const changes = {};

    // Track changes for all fields
    const updateFields = ['name', 'contact', 'gstNumber', 'shopAddress'];
    updateFields.forEach((key) => {
      if (req.body[key] !== undefined && dealer[key] !== req.body[key]) {
        changes[key] = { 
          old: dealer[key], 
          new: req.body[key] 
        };
        dealer[key] = req.body[key];
      }
    });

    // Add to update history
    if (Object.keys(changes).length > 0 || req.file) {
      dealer.updates.push({
        snapshot: oldSnapshot,
        changes,
        image: oldSnapshot.image
      });
    }

    // Update image if new file uploaded
    if (req.file) {
      dealer.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await dealer.save();
    
    // Return response without image buffer
    const dealerResponse = dealer.toObject();
    delete dealerResponse.image;
    
    res.status(200).json({
      ...dealerResponse,
      message: "Dealer updated successfully"
    });
  } catch (err) {
    console.error("UPDATE DEALER ERROR:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid dealer ID" });
    }
    
    res.status(500).json({ 
      error: err.message || "Server error occurred" 
    });
  }
};