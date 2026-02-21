


// models/accessRequestModel.js
import mongoose from "mongoose";

const accessRequestSchema = new mongoose.Schema({
  requesterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  targetAgentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  targetFarmerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Farmer",
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"],
    default: "pending" 
  },
  requestType: {
    type: String,
    enum: ["agent", "farmer"],
    default: "farmer"
  },
  notes: {
    type: String,
    default: ""
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rejectedAt: {
    type: Date
  },
  rejectedReason: {
    type: String
  }
}, { 
  timestamps: true 
});

export default mongoose.model("AccessRequest", accessRequestSchema);