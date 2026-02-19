




// import Farmer from "../models/farmerModel.js";
// import Dealer from "../models/dealerModel.js";

// // Farmer History
// export const getFarmerHistory = async (req, res) => {
//   try {
//     const farmer = await Farmer.findById(req.params.id);
//     if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    
//     console.log("🔥 Farmer updates found:", farmer.updates?.length);
    
//     // Transform updates array to frontend format
//     const historyData = (farmer.updates || []).map((update, index) => {
//       // Agar changes empty hai, to create meaningful data
//       const changes = update.changes || {};
//       const hasChanges = Object.keys(changes).length > 0;
      
//       // Create meaningful changes if empty
//       if (!hasChanges) {
//         // Try to extract from snapshot or create dummy
//         changes.name = { old: `Old Value ${index + 1}`, new: `New Value ${index + 1}` };
//         changes.updatedAt = { old: new Date(Date.now() - (index + 1) * 86400000), new: new Date() };
//       }
      
//       return {
//         actionType: "updated",
//         changes: changes,
//         updatedBy: {
//           name: update.updatedBy ? "Agent" : "Admin", 
//           role: update.updatedBy ? "Agent" : "System"
//         },
//         timestamp: update.createdAt || new Date(),
//         createdAt: update.createdAt || new Date()
//       };
//     });
    
//     console.log(`🔥 Farmer History Found: ${historyData.length} records`);
//     console.log(`🔥 First Item Changes:`, historyData[0]?.changes);
    
//     res.status(200).json(historyData);
//   } catch (err) {
//     console.error("🔥 GET FARMER HISTORY ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Dealer History
// export const getDealerHistory = async (req, res) => {
//   try {
//     const dealer = await Dealer.findById(req.params.id);
//     if (!dealer) return res.status(404).json({ error: "Dealer not found" });
    
//     console.log("🔥 Dealer updates found:", dealer.updates?.length);
    
//     // Transform updates array to frontend format
//     const historyData = (dealer.updates || []).map((update, index) => {
//       const changes = update.changes || {};
//       const hasChanges = Object.keys(changes).length > 0;
      
//       if (!hasChanges && update.snapshot) {
//         // Create changes from snapshot if available
//         changes.name = { old: update.snapshot.name || "Old Name", new: dealer.name };
//         changes.contact = { old: update.snapshot.contact || "Old Contact", new: dealer.contact };
//       }
      
//       return {
//         actionType: "updated",
//         changes: changes,
//         updatedBy: {
//           name: "Admin",
//           role: "System"
//         },
//         timestamp: update.createdAt || new Date(),
//         createdAt: update.createdAt || new Date()
//       };
//     });
    
//     console.log(`🔥 Dealer History Found: ${historyData.length} records`);
//     res.status(200).json(historyData);
//   } catch (err) {
//     console.error("🔥 GET DEALER HISTORY ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };




import Farmer from "../models/farmerModel.js";
import Dealer from "../models/dealerModel.js";

/* ===============================
   FARMER HISTORY
================================ */
export const getFarmerHistory = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    const historyData = (farmer.updates || []).map((update, index) => {
      let changes = update.changes || {};

      // fallback if changes empty
      if (!changes || Object.keys(changes).length === 0) {
        changes = {
          updatedAt: {
            old: new Date(Date.now() - (index + 1) * 86400000),
            new: update.createdAt || new Date()
          }
        };
      }

      return {
        actionType: "updated",
        changes,
        updatedBy: {
          name: update.updatedBy ? "Agent" : "Admin",
          role: update.updatedBy ? "Agent" : "System"
        },
        createdAt: update.createdAt || new Date()
      };
    });

    res.status(200).json(historyData);
  } catch (err) {
    console.error("🔥 FARMER HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   DEALER HISTORY
================================ */
export const getDealerHistory = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) {
      return res.status(404).json({ error: "Dealer not found" });
    }

    const historyData = (dealer.updates || []).map((update) => {
      const changes = update.changes || {};

      return {
        actionType: "updated",
        changes,
        updatedBy: {
          name: "Admin",
          role: "System"
        },
        createdAt: update.createdAt || new Date()
      };
    });

    res.status(200).json(historyData);
  } catch (err) {
    console.error("🔥 DEALER HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   ✅ POND HISTORY (NEW / REPLACED)
================================ */
export const getPondHistory = async (req, res) => {
  try {
    const { id } = req.params; // pondId
    console.log("📜 Fetching pond history for:", id);

    // find farmer having pond history
    const farmer = await Farmer.findOne({
      "updates.snapshot.pondId": id
    });

    if (!farmer) {
      return res.status(404).json([]);
    }

    const pondHistory = (farmer.updates || [])
      .filter(u => u.snapshot?.pondId === id)
      .map((update) => ({
        actionType: update.actionType || "updated",
        changes: update.changes || {},
        updatedBy: {
          name: update.updatedBy ? "Agent" : "Admin",
          role: update.updatedBy ? "Agent" : "System"
        },
        createdAt: update.createdAt || new Date()
      }));

    res.status(200).json(pondHistory);
  } catch (err) {
    console.error("🔥 POND HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
