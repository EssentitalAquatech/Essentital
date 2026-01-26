







// // import mongoose from "mongoose";
// // import Counter from "./counterModel.js";

// // /* ===============================
// //    HELPER: GET FARMER BY _id OR farmerId
// // ================================ */
// // export async function getFarmerByAnyId(farmerId) {
// //   if (mongoose.Types.ObjectId.isValid(farmerId)) {
// //     const farmer = await Farmer.findById(farmerId);
// //     if (farmer) return farmer;
// //   }
// //   return await Farmer.findOne({ farmerId });
// // }

// // /* ===============================
// //    POND SCHEMA
// // ================================ */
// // const PondSchema = new mongoose.Schema({
// //   pondId: {
// //     type: String,
// //     required: true,
// //     index: true,
// //     // immutable: true
// //   },

// //   pondNumber: { type: Number, required: true,  immutable: true },

// //   pondArea: String,
// //   pondAreaUnit: { type: String, default: "acre" },
// //   pondDepth: String,
// //   pondImage: String,

// //   overflow: String,
// //   receivesSunlight: String,
// //   treesOnBanks: String,
// //   neighbourhood: String,
// //   wastewaterEnters: String,

// //   species: String,
// //   dateOfStocking: Date,
// //   qtySeedInitially: String,
// //   currentQty: String,
// //   avgSize: String,

// //   feedType: String,
// //   feedOther: String,
// //   feedFreq: String,
// //   feedQtyPerDay: String,
// //   feedTime: String,
// //   recentFeedChanges: String,
// //   reducedAppetite: String,

// //   waterTemperature: String,
// //   pH: String,
// //   DO: String,
// //   ammoniaLevel: String,
// //   phytoplanktonLevel: String,
// //   waterHardness: String,
// //   algaeBloom: String,
// //   pondWaterColor: String,
// //   sourceOfWater: String,

// //   diseaseSymptoms: String,
// //   symptomsObserved: String,
// //   fishDeaths: String,
// //   symptomsAffect: String,

// //   farmObservedDate: Date,
// //   farmObservedTime: String,

// //   lastSpecies: String,
// //   lastHarvestComplete: String,
// //   recentRainFlood: String,
// //   pesticideRunoff: String,
// //   constructionNear: String,
// //   suddenTempChange: String,

// //   notes: String,

// //   pondFiles: [String],
// //   fishFiles: [String],

// //   updatedAt: { type: Date, default: Date.now },
// //   createdAt: { type: Date, default: Date.now }
// // }, { _id: false });

// // /* ===============================
// //    FARMER UPDATE LOG SCHEMA
// // ================================ */
// // const farmerUpdateSchema = new mongoose.Schema({
// //   snapshot: { type: Object },
// //   changes: { type: Object },
// //   pondFiles: [String],
// //   fishFiles: [String],
// //   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// //   createdAt: { type: Date, default: Date.now }
// // }, { _id: false });

// // /* ===============================
// //    FARMER SCHEMA
// // ================================ */
// // const farmerSchema = new mongoose.Schema({
// //   farmerId: { type: String, unique: true },

// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

// //   /* Farmer Basic Details */
// //   name: { type: String, required: true },
// //   contact: { type: String, required: true },
// //   age: String,
// //   gender: String,
// //   adhar: String,
// //   familyMembers: String,
// //   familyOccupation: String,
// //   village: String,

// //   pondCount: { type: Number, default: 0 },
// //   photo: String,

// //   /* PONDS ARRAY */
// //   ponds: [PondSchema],

// //   /* Farmer level files */
// //   pondFiles: [String],
// //   fishFiles: [String],

// //   /* Update history */
// //   updates: [farmerUpdateSchema]

// // }, { timestamps: true });

// // /* ===============================
// //    AUTO FARMER ID GENERATION
// // ================================ */
// // farmerSchema.pre("save", async function () {
// //   if (this.farmerId) return;

// //   const year = new Date().getFullYear();

// //   const counter = await Counter.findOneAndUpdate(
// //     { id: "farmer" },
// //     { $inc: { seq: 1 } },
// //     { new: true, upsert: true }
// //   );

// //   const serial = String(counter.seq).padStart(5, "0");
// //   this.farmerId = `FAR-${year}-${serial}`;
// // });


// // const Farmer = mongoose.model("Farmer", farmerSchema);
// // export default Farmer;







// //uper vala sahi hai 









//buffer ke liye
// models/farmerModel.js
import mongoose from "mongoose";
import Counter from "./counterModel.js";

/* ===============================
   POND SCHEMA
================================ */
const PondSchema = new mongoose.Schema({
  pondId: { type: String, required: true },
  pondNumber: { type: Number, required: true },

  pondArea: { type: String, required: true },
  pondAreaUnit: { type: String, default: "acre" },
  pondDepth: { type: String, required: true },

  pondImage: { type: Buffer }, // ❌ removed required

  overflow: { type: String, default: "No" },
  receivesSunlight: { type: String, default: "Yes" },
  treesOnBanks: { type: String, default: "No" },
  neighbourhood: { type: String, default: "Agriculture Farm" },
  wastewaterEnters: { type: String, default: "No" },

  species: { type: String, required: true },
  dateOfStocking: { type: Date, required: true },
  qtySeedInitially: { type: String, required: true },
  currentQty: { type: String, required: true },
  avgSize: { type: String, default: ">200gram" },

  feedType: { type: String, default: "Market Feed" },
  feedOther: { type: String, default: "" },
  feedFreq: { type: String, default: "Once a day" },
  feedQtyPerDay: { type: String, default: "" },
  feedTime: { type: String, default: "6:00 am-10:00am" },
  recentFeedChanges: { type: String, default: "" },
  reducedAppetite: { type: String, default: "No" },

  waterTemperature: { type: String, required: true },
  pH: { type: String, required: true },
  DO: { type: String, required: true },

  ammoniaLevel: { type: String, default: "Medium" },
  phytoplanktonLevel: { type: String, default: "Medium" },
  waterHardness: { type: String, default: "1" },
  algaeBloom: { type: String, default: "No" },
  pondWaterColor: { type: String, default: "Light Green" },
  sourceOfWater: { type: String, default: "Rainwater" },

  diseaseSymptoms: { type: String, default: "No" },
  symptomsObserved: { type: String, default: "" },
  fishDeaths: { type: String, default: "" },
  symptomsAffect: { type: String, default: "All" },

  farmObservedDate: { type: Date, required: true },
  farmObservedTime: { type: String, required: true },

  lastSpecies: { type: String, default: "" },
  lastHarvestComplete: { type: String, default: "Yes" },
  recentRainFlood: { type: String, default: "No" },
  pesticideRunoff: { type: String, default: "No" },
  constructionNear: { type: String, default: "No" },
  suddenTempChange: { type: String, default: "No" },

  notes: { type: String, default: "" },

  pondFiles: { type: [Buffer], default: [] },
  fishFiles: { type: [Buffer], default: [] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

/* ===============================
   FARMER SCHEMA
================================ */
const farmerSchema = new mongoose.Schema({
  farmerId: { type: String, unique: true, index: true },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  contact: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  adhar: { type: String, required: true },
  familyMembers: { type: String, required: true },
  familyOccupation: { type: String, required: true },
  village: { type: String, required: true },

  pondCount: { type: Number, default: 0 },
  photo: { type: Buffer, required: true },

  ponds: { type: [PondSchema], default: [] },

  pondFiles: { type: [Buffer], default: [] },
  fishFiles: { type: [Buffer], default: [] },

  updates: { type: Array, default: [] }
}, { timestamps: true });

/* ===============================
   PRE SAVE – ID GENERATION (ONLY PLACE)
================================ */
farmerSchema.pre("save", async function () {
  if (!this.farmerId) {
    const year = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
      { id: "farmer" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.farmerId = `FAR-${year}-${String(counter.seq).padStart(5, "0")}`;
  }
});

/* ===============================
   HELPER
================================ */
farmerSchema.statics.getFarmerByAnyId = async function (id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const doc = await this.findById(id);
    if (doc) return doc;
  }
  return this.findOne({ farmerId: id });
};

export default mongoose.model("Farmer", farmerSchema);
