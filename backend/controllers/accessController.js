

// controllers/accessController.js
import AccessRequest from "../models/accessRequestModel.js";
import Farmer from "../models/farmerModel.js";
import Notification from "../models/notificationModel.js";

// Get all pending access requests for admin
export const getAccessRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find({ status: "pending" })
      .populate("requesterId", "name email")
      .populate("targetAgentId", "name email")
      .populate("targetFarmerId", "name contact village")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching access requests:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Allow access request (admin)
export const allowAccessRequest = async (req, res) => {
  try {
    const { requestId, approvedBy } = req.body;

    // 1️⃣ Update the request status
    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      { 
        status: "approved",
        approvedBy,
        approvedAt: new Date()
      },
      { new: true }
    ).populate("requesterId targetAgentId targetFarmerId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 2️⃣ Fetch only the requested farmer's details
    const farmer = await Farmer.findById(request.targetFarmerId._id);

    // 3️⃣ Create notification for requester
    const notification = new Notification({
      userId: request.requesterId,
      message: `Your access request for farmer ${farmer.name} has been approved`,
      type: "access_approved",
      relatedRequest: requestId
    });
    await notification.save();

    res.status(200).json({ 
      message: "Access request approved",
      farmer,          // sirf requested farmer ka data bhej rahe hain
      request 
    });
  } catch (err) {
    console.error("Error allowing access request:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject access request (admin)
export const rejectAccessRequest = async (req, res) => {
  try {
    const { requestId, rejectedBy, rejectedReason } = req.body;

    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      { 
        status: "rejected",
        rejectedBy,
        rejectedAt: new Date(),
        rejectedReason
      },
      { new: true }
    ).populate("requesterId targetAgentId targetFarmerId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Create notification for requester
    const notification = new Notification({
      userId: request.requesterId,
      message: `Your access request for farmer ${request.targetFarmerId?.name} has been rejected`,
      type: "access_rejected",
      relatedRequest: requestId
    });
    await notification.save();

    res.status(200).json({ 
      message: "Access request rejected",
      request 
    });
  } catch (err) {
    console.error("Error rejecting access request:", err);
    res.status(500).json({ message: "Server error" });
  }
};