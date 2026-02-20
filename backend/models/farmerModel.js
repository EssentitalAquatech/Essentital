





// import mongoose from "mongoose";
// import Counter from "./counterModel.js";

// /* ===============================
//    POND SCHEMA - WITH CLOUDINARY URLS
// ================================ */
// const PondSchema = new mongoose.Schema({
//   pondId: { type: String, required: true },
//   pondNumber: { type: Number, required: true },

//   pondArea: { type: String, required: true },
//   pondAreaUnit: { type: String, default: "acre" },
//   pondDepth: { type: String, required: true },

//   // Cloudinary URLs instead of Buffer
//   pondImage: { type: String }, // Cloudinary URL
//   uploadSelfie: { type: String }, // Cloudinary URL

//   latitude: { 
//     type: Number,
//     required: true,
//     min: -90,
//     max: 90
//   },
//   longitude: { 
//     type: Number,
//     required: true,
//     min: -180,
//     max: 180
//   },

//   overflow: { type: String, default: "No" },
//   receivesSunlight: { type: String, default: "Yes" },
//   treesOnBanks: { type: String, default: "No" },
//   neighbourhood: { type: String, default: "Agriculture Farm" },
//   wastewaterEnters: { type: String, default: "No" },

//   species: { type: String, required: true },
//   dateOfStocking: { type: Date, required: true },
//   qtySeedInitially: { type: String, required: true },
//   currentQty: { type: String, required: true },
//   avgSize: { type: String, default: ">200gram" },

//   feedType: { type: String, default: "Market Feed" },
//   feedOther: { type: String, default: "" },
//   feedFreq: { type: String, default: "Once a day" },
//   feedQtyPerDay: { type: String, default: "" },
//   feedTime: { type: String, default: "6:00 am-10:00am" },
//   recentFeedChanges: { type: String, default: "" },
//   reducedAppetite: { type: String, default: "No" },

//   waterTemperature: { type: String, required: true },
//   pH: { type: String, required: true },
//   DO: { type: String, required: true },

//   ammoniaLevel: { type: String, default: "Medium" },
//   phytoplanktonLevel: { type: String, default: "Medium" },
//   waterHardness: { type: String, default: "1" },
//   algaeBloom: { type: String, default: "No" },
//   pondWaterColor: { type: String, default: "Light Green" },
//   sourceOfWater: { type: String, default: "Rainwater" },

//   diseaseSymptoms: { type: String, default: "No" },
//   symptomsObserved: { type: String, default: "" },
//   fishDeaths: { type: String, default: "" },
//   symptomsAffect: { type: String, default: "All" },

//   farmObservedDate: { type: Date, required: true },
//   farmObservedTime: { type: String, required: true },

//   lastSpecies: { type: String, default: "" },
//   lastHarvestComplete: { type: String, default: "Yes" },
//   recentRainFlood: { type: String, default: "No" },
//   pesticideRunoff: { type: String, default: "No" },
//   constructionNear: { type: String, default: "No" },
//   suddenTempChange: { type: String, default: "No" },

//   notes: { type: String, default: "" },

//   // Arrays of Cloudinary URLs instead of Buffers
//   pondFiles: { type: [String], default: [] }, // Array of Cloudinary URLs
//   fishFiles: { type: [String], default: [] }, // Array of Cloudinary URLs

//   // Cloudinary public IDs for deletion (optional, can extract from URL)
//   pondImagePublicId: { type: String },
//   uploadSelfiePublicId: { type: String },
//   pondFilesPublicIds: { type: [String], default: [] },
//   fishFilesPublicIds: { type: [String], default: [] },

//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, { 
//   strict: false,
//   minimize: false
// });

// /* ===============================
//    FARMER SCHEMA - WITH CLOUDINARY
// ================================ */
// const farmerSchema = new mongoose.Schema({
//   farmerId: { type: String, unique: true, index: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true },
//   contact: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function (v) {
//         return /^\d{10}$/.test(v);
//       },
//       message: "Phone number must be exactly 10 digits and numeric only"
//     }
//   },
//   age: { type: String, required: true },
//   gender: { type: String, required: true },
//   adhar: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function (v) {
//         return /^\d{12}$/.test(v);
//       },
//       message: "Aadhar number must be exactly 12 digits and numeric only"
//     }
//   },
//   familyMembers: { type: String, required: true },
//   familyOccupation: { type: String, required: true },
//   village: { type: String, required: true },
//   pondCount: { type: Number, default: 0 },
  
//   // Cloudinary URL instead of Buffer
//   photo: { type: String }, // Cloudinary URL
//   photoPublicId: { type: String }, // For deletion
  
//   ponds: { type: [PondSchema], default: [] },
  
//   // Global arrays for files (if any)
//   pondFiles: { type: [String], default: [] },
//   pondFilesPublicIds: { type: [String], default: [] },
//   fishFiles: { type: [String], default: [] },
//   fishFilesPublicIds: { type: [String], default: [] },
  
//   updates: { type: Array, default: [] }
// }, { 
//   timestamps: true,
//   strict: false,
//   minimize: false 
// });

// /* ===============================
//    PRE SAVE – ID GENERATION
// ================================ */
// farmerSchema.pre("save", async function () {
//   if (!this.farmerId) {
//     const year = new Date().getFullYear();
//     const counter = await Counter.findOneAndUpdate(
//       { id: "farmer" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );
//     this.farmerId = `FAR-${year}-${String(counter.seq).padStart(5, "0")}`;
//   }
// });

// /* ===============================
//    HELPER
// ================================ */
// farmerSchema.statics.getFarmerByAnyId = async function (id) {
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     const doc = await this.findById(id);
//     if (doc) return doc;
//   }
//   return this.findOne({ farmerId: id });
// };

// export default mongoose.model("Farmer", farmerSchema);

















//uper vala sahi hai 





import express from "express";
import upload from "../middlewares/uploads.js";
import {
  addFarmer,
  getFarmers,
  updateFarmer,
  getFarmersByAgent,
  getFarmerById,
  addPondToFarmer,
  updatePond,
  deleteFarmer
} from "../controllers/farmerController.js";

const router = express.Router();

/* ===============================
   ADD POND - WITH CLOUDINARY
================================ */
router.post(
  "/add-pond/:farmerId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 },
    { name: "uploadSelfie", maxCount: 1 }
  ]),
  addPondToFarmer
);

/* ===============================
   UPDATE POND - WITH CLOUDINARY
================================ */
router.put(
  "/update-pond/:farmerId/:pondId",
  upload.fields([
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 },
    { name: "uploadSelfie", maxCount: 1 }
  ]),
  updatePond
);

/* ===============================
   DELETE FARMER
================================ */
router.delete("/:id", deleteFarmer);

/* ===============================
   OTHER ROUTES
================================ */
router.get("/all", getFarmers);
router.get("/by-agent", getFarmersByAgent);
router.get("/:id", getFarmerById);
router.post(
  "/add",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  addFarmer
);
router.put(
  "/update/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "pondImage", maxCount: 1 },
    { name: "pondFiles", maxCount: 20 },
    { name: "fishFiles", maxCount: 20 }
  ]),
  updateFarmer
);

export default router;
