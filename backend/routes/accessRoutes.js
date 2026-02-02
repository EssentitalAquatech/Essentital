




// import express from "express";
// import AccessRequest from "../models/accessRequestModel.js";
// const router = express.Router();

// // POST → agent requests access
// router.post("/request", async (req, res) => {
//   try {
//     const { requesterId, targetAgentId } = req.body;
//     const newRequest = await AccessRequest.create({ requesterId, targetAgentId });
//     res.json({ success: true, request: newRequest });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET → admin fetches only pending requests
// router.get("/requests", async (req, res) => {
//   try {
//     const requests = await AccessRequest.find({ status: "pending" })
//       .populate("requesterId", "name")
//       .populate("targetAgentId", "name")
//       .sort({ createdAt: -1 });

//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST → admin allows access
// router.post("/allow", async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const reqDoc = await AccessRequest.findByIdAndUpdate(
//       requestId,
//       { status: "approved" },
//       { new: true }
//     );
//     res.json({ success: true, request: reqDoc });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST → admin rejects access
// router.post("/reject", async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const reqDoc = await AccessRequest.findByIdAndUpdate(
//       requestId,
//       { status: "rejected" },
//       { new: true }
//     );
//     res.json({ success: true, request: reqDoc });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // ⭐ NEW → Check if agent access is approved
// router.get("/check/:agentId", async (req, res) => {
//   try {
//     const request = await AccessRequest.findOne({
//       requesterId: req.params.agentId,
//       status: "approved",
//     });

//     if (!request) {
//       return res.json({ approved: false });
//     }

//     res.json({ approved: true });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// export default router;










// import express from "express";
// import AccessRequest from "../models/accessRequestModel.js";
// import Farmer from "../models/farmerModel.js";
// import {
//   getAccessRequests,
//   allowAccessRequest,
//   rejectAccessRequest,
// } from "../controllers/accessController.js";

// const router = express.Router();

// // ✅ Check if agent has access to all farmers
// router.get("/check/:agentId", async (req, res) => {
//   try {
//     const { agentId } = req.params;

//     // Example logic: check if agent has any approved access requests
//     const approvedRequests = await AccessRequest.find({
//       requesterId: agentId,
//       status: "approved"
//     });

//     res.status(200).json({ approved: approvedRequests.length > 0 });
//   } catch (err) {
//     console.error("Error checking agent access:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Check individual farmer access
// router.get("/check-farmer", async (req, res) => {
//   try {
//     const { requesterId, farmerId } = req.query;

//     // Find approved access request for this specific farmer
//     const request = await AccessRequest.findOne({
//       requesterId,
//       targetFarmerId: farmerId,
//       status: "approved",
//     });

//     res.status(200).json({ approved: !!request });
//   } catch (err) {
//     console.error("Error checking farmer access:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Request access for an agent (all farmers)
// router.post("/request", async (req, res) => {
//   try {
//     const { requesterId, targetAgentId } = req.body;

//     // Check if request already exists for any farmer
//     const existingRequest = await AccessRequest.findOne({
//       requesterId,
//       createdBy: targetAgentId, // Assuming createdBy stores agent ID who created farmer
//       status: "pending"
//     });

//     if (existingRequest) {
//       return res.status(400).json({ message: "Access request already pending" });
//     }

//     // Create requests for all farmers under the agent
//     const farmers = await Farmer.find({ createdBy: targetAgentId });
    
//     if (farmers.length === 0) {
//       return res.status(404).json({ message: "No farmers found for this agent" });
//     }

//     const requests = farmers.map(f => ({
//       requesterId,
//       targetAgentId,
//       targetFarmerId: f._id,
//       status: "pending",
//       createdAt: new Date()
//     }));

//     await AccessRequest.insertMany(requests);

//     res.status(200).json({ 
//       message: `Access requests sent for ${farmers.length} farmers`,
//       count: farmers.length
//     });
//   } catch (err) {
//     console.error("Error requesting agent access:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Request access for a single farmer
// router.post("/request-farmer", async (req, res) => {
//   try {
//     const { requesterId, farmerId } = req.body;

//     // Get farmer details to know which agent owns it
//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ message: "Farmer not found" });
//     }

//     const existing = await AccessRequest.findOne({
//       requesterId,
//       targetFarmerId: farmerId
//     });

//     if (existing) {
//       return res.status(400).json({ message: "Request already exists" });
//     }

//     const newRequest = new AccessRequest({
//       requesterId,
//       targetAgentId: farmer.createdBy,
//       targetFarmerId: farmerId,
//       status: "pending",
//       createdAt: new Date()
//     });

//     await newRequest.save();
    
//     res.status(200).json({ 
//       message: "Access request sent",
//       request: newRequest
//     });
//   } catch (err) {
//     console.error("Error requesting farmer access:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Admin: Get all pending access requests
// router.get("/requests", getAccessRequests);

// // ✅ Admin: Allow access request
// router.post("/allow", allowAccessRequest);

// // ✅ Admin: Reject access request
// router.post("/reject", rejectAccessRequest);

// // ✅ Check existing request (for frontend validation)
// router.get("/check-existing", async (req, res) => {
//   try {
//     const { requesterId, targetAgentId } = req.query;

//     const existingRequest = await AccessRequest.findOne({
//       requesterId,
//       targetAgentId,
//       status: { $in: ["pending", "approved"] }
//     });

//     res.status(200).json({ exists: !!existingRequest });
//   } catch (err) {
//     console.error("Error checking existing request:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Get all access requests for a specific agent (for admin panel)
// router.get("/agent-requests/:agentId", async (req, res) => {
//   try {
//     const { agentId } = req.params;
    
//     const requests = await AccessRequest.find({
//       $or: [
//         { requesterId: agentId },
//         { targetAgentId: agentId }
//       ]
//     })
//     .populate("requesterId", "name email")
//     .populate("targetAgentId", "name email")
//     .populate("targetFarmerId", "name contact village")
//     .sort({ createdAt: -1 });

//     res.status(200).json(requests);
//   } catch (err) {
//     console.error("Error fetching agent requests:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Get statistics for dashboard
// router.get("/stats", async (req, res) => {
//   try {
//     const totalRequests = await AccessRequest.countDocuments();
//     const pendingRequests = await AccessRequest.countDocuments({ status: "pending" });
//     const approvedRequests = await AccessRequest.countDocuments({ status: "approved" });
//     const rejectedRequests = await AccessRequest.countDocuments({ status: "rejected" });

//     res.status(200).json({
//       total: totalRequests,
//       pending: pendingRequests,
//       approved: approvedRequests,
//       rejected: rejectedRequests
//     });
//   } catch (err) {
//     console.error("Error fetching access stats:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;


















import express from "express";
import AccessRequest from "../models/accessRequestModel.js";
import Farmer from "../models/farmerModel.js";
import {
  getAccessRequests,
  allowAccessRequest,
  rejectAccessRequest,
} from "../controllers/accessController.js";

const router = express.Router();

// ✅ Check if agent has access to all farmers (OLD - Remove or modify)
router.get("/check/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;

    // Check if agent has any approved access requests
    const approvedRequests = await AccessRequest.find({
      requesterId: agentId,
      status: "approved"
    });

    res.status(200).json({ approved: approvedRequests.length > 0 });
  } catch (err) {
    console.error("Error checking agent access:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Check individual farmer access (FIX THIS)
router.get("/check-farmer", async (req, res) => {
  try {
    const { requesterId, farmerId } = req.query;

    // Find approved access request for this specific farmer
    const request = await AccessRequest.findOne({
      requesterId,
      targetFarmerId: farmerId,
      status: "approved",
    });

    res.status(200).json({ 
      approved: !!request,
      requestId: request?._id 
    });
  } catch (err) {
    console.error("Error checking farmer access:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ NEW: Check access for multiple farmers at once
router.post("/check-multiple-farmers", async (req, res) => {
  try {
    const { requesterId, farmerIds } = req.body;
    
    const accessMap = {};
    
    for (const farmerId of farmerIds) {
      const request = await AccessRequest.findOne({
        requesterId,
        targetFarmerId: farmerId,
        status: "approved"
      });
      
      accessMap[farmerId] = !!request;
    }
    
    res.status(200).json({ access: accessMap });
  } catch (err) {
    console.error("Error checking multiple farmers access:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Request access for an agent (all farmers) - This creates requests for ALL farmers
router.post("/request", async (req, res) => {
  try {
    const { requesterId, targetAgentId } = req.body;

    // Check if bulk request already exists
    const existingRequest = await AccessRequest.findOne({
      requesterId,
      targetAgentId,
      requestType: "agent",
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Bulk access request already pending" });
    }

    // Create requests for all farmers under the agent
    const farmers = await Farmer.find({ createdBy: targetAgentId });
    
    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmers found for this agent" });
    }

    const requests = farmers.map(f => ({
      requesterId,
      targetAgentId,
      targetFarmerId: f._id,
      status: "pending",
      requestType: "agent", // Mark as bulk request
      createdAt: new Date()
    }));

    await AccessRequest.insertMany(requests);

    res.status(200).json({ 
      message: `Access requests sent for ${farmers.length} farmers`,
      count: farmers.length
    });
  } catch (err) {
    console.error("Error requesting agent access:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Request access for a single farmer
router.post("/request-farmer", async (req, res) => {
  try {
    const { requesterId, farmerId } = req.body;

    // Get farmer details to know which agent owns it
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Check if request already exists
    const existing = await AccessRequest.findOne({
      requesterId,
      targetFarmerId: farmerId
    });

    if (existing) {
      return res.status(400).json({ 
        message: "Request already exists",
        status: existing.status 
      });
    }

    const newRequest = new AccessRequest({
      requesterId,
      targetAgentId: farmer.createdBy,
      targetFarmerId: farmerId,
      status: "pending",
      requestType: "farmer", // Mark as single farmer request
      createdAt: new Date()
    });

    await newRequest.save();
    
    res.status(200).json({ 
      message: "Access request sent",
      request: newRequest
    });
  } catch (err) {
    console.error("Error requesting farmer access:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin: Get all pending access requests
router.get("/requests", getAccessRequests);

// ✅ Admin: Allow access request
router.post("/allow", allowAccessRequest);

// ✅ Admin: Reject access request
router.post("/reject", rejectAccessRequest);

// ✅ Check existing request (for frontend validation)
router.get("/check-existing", async (req, res) => {
  try {
    const { requesterId, targetAgentId, farmerId } = req.query;

    let query = { requesterId };
    
    if (farmerId) {
      query.targetFarmerId = farmerId;
    } else if (targetAgentId) {
      query.targetAgentId = targetAgentId;
    }

    const existingRequest = await AccessRequest.findOne({
      ...query,
      status: { $in: ["pending", "approved"] }
    });

    res.status(200).json({ exists: !!existingRequest });
  } catch (err) {
    console.error("Error checking existing request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all access requests for a specific agent (for admin panel)
router.get("/agent-requests/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const requests = await AccessRequest.find({
      $or: [
        { requesterId: agentId },
        { targetAgentId: agentId }
      ]
    })
    .populate("requesterId", "name email")
    .populate("targetAgentId", "name email")
    .populate("targetFarmerId", "name contact village")
    .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching agent requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get approved farmers for a specific agent
router.get("/approved-farmers/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const approvedRequests = await AccessRequest.find({
      requesterId: agentId,
      status: "approved"
    })
    .populate("targetFarmerId")
    .sort({ approvedAt: -1 });

    // Extract only approved farmers
    const approvedFarmers = approvedRequests
      .filter(req => req.targetFarmerId)
      .map(req => req.targetFarmerId);

    res.status(200).json(approvedFarmers);
  } catch (err) {
    console.error("Error fetching approved farmers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get statistics for dashboard
router.get("/stats", async (req, res) => {
  try {
    const totalRequests = await AccessRequest.countDocuments();
    const pendingRequests = await AccessRequest.countDocuments({ status: "pending" });
    const approvedRequests = await AccessRequest.countDocuments({ status: "approved" });
    const rejectedRequests = await AccessRequest.countDocuments({ status: "rejected" });

    res.status(200).json({
      total: totalRequests,
      pending: pendingRequests,
      approved: approvedRequests,
      rejected: rejectedRequests
    });
  } catch (err) {
    console.error("Error fetching access stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;




// uper vala sahi hai




















