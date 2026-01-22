







// import mongoose from "mongoose";
// import Counter from "./counterModel.js";

// /* ===============================
//    HELPER: GET FARMER BY _id OR farmerId
// ================================ */
// export async function getFarmerByAnyId(farmerId) {
//   if (mongoose.Types.ObjectId.isValid(farmerId)) {
//     const farmer = await Farmer.findById(farmerId);
//     if (farmer) return farmer;
//   }
//   return await Farmer.findOne({ farmerId });
// }

// /* ===============================
//    POND SCHEMA
// ================================ */
// const PondSchema = new mongoose.Schema({
//   pondId: {
//     type: String,
//     required: true,
//     index: true,
//     // immutable: true
//   },

//   pondNumber: { type: Number, required: true,  immutable: true },

//   pondArea: String,
//   pondAreaUnit: { type: String, default: "acre" },
//   pondDepth: String,
//   pondImage: String,

//   overflow: String,
//   receivesSunlight: String,
//   treesOnBanks: String,
//   neighbourhood: String,
//   wastewaterEnters: String,

//   species: String,
//   dateOfStocking: Date,
//   qtySeedInitially: String,
//   currentQty: String,
//   avgSize: String,

//   feedType: String,
//   feedOther: String,
//   feedFreq: String,
//   feedQtyPerDay: String,
//   feedTime: String,
//   recentFeedChanges: String,
//   reducedAppetite: String,

//   waterTemperature: String,
//   pH: String,
//   DO: String,
//   ammoniaLevel: String,
//   phytoplanktonLevel: String,
//   waterHardness: String,
//   algaeBloom: String,
//   pondWaterColor: String,
//   sourceOfWater: String,

//   diseaseSymptoms: String,
//   symptomsObserved: String,
//   fishDeaths: String,
//   symptomsAffect: String,

//   farmObservedDate: Date,
//   farmObservedTime: String,

//   lastSpecies: String,
//   lastHarvestComplete: String,
//   recentRainFlood: String,
//   pesticideRunoff: String,
//   constructionNear: String,
//   suddenTempChange: String,

//   notes: String,

//   pondFiles: [String],
//   fishFiles: [String],

//   updatedAt: { type: Date, default: Date.now },
//   createdAt: { type: Date, default: Date.now }
// }, { _id: false });

// /* ===============================
//    FARMER UPDATE LOG SCHEMA
// ================================ */
// const farmerUpdateSchema = new mongoose.Schema({
//   snapshot: { type: Object },
//   changes: { type: Object },
//   pondFiles: [String],
//   fishFiles: [String],
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdAt: { type: Date, default: Date.now }
// }, { _id: false });

// /* ===============================
//    FARMER SCHEMA
// ================================ */
// const farmerSchema = new mongoose.Schema({
//   farmerId: { type: String, unique: true },

//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//   /* Farmer Basic Details */
//   name: { type: String, required: true },
//   contact: { type: String, required: true },
//   age: String,
//   gender: String,
//   adhar: String,
//   familyMembers: String,
//   familyOccupation: String,
//   village: String,

//   pondCount: { type: Number, default: 0 },
//   photo: String,

//   /* PONDS ARRAY */
//   ponds: [PondSchema],

//   /* Farmer level files */
//   pondFiles: [String],
//   fishFiles: [String],

//   /* Update history */
//   updates: [farmerUpdateSchema]

// }, { timestamps: true });

// /* ===============================
//    AUTO FARMER ID GENERATION
// ================================ */
// farmerSchema.pre("save", async function () {
//   if (this.farmerId) return;

//   const year = new Date().getFullYear();

//   const counter = await Counter.findOneAndUpdate(
//     { id: "farmer" },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );

//   const serial = String(counter.seq).padStart(5, "0");
//   this.farmerId = `FAR-${year}-${serial}`;
// });


// const Farmer = mongoose.model("Farmer", farmerSchema);
// export default Farmer;







//uper vala sahi hai 
















import mongoose from "mongoose";
import Counter from "./counterModel.js";

/* ===============================
   HELPER: GET FARMER BY _id OR farmerId
================================ */
export async function getFarmerByAnyId(farmerId) {
  if (mongoose.Types.ObjectId.isValid(farmerId)) {
    const farmer = await Farmer.findById(farmerId);
    if (farmer) return farmer;
  }
  return await Farmer.findOne({ farmerId });
}

/* ===============================
   POND SCHEMA
================================ */
const PondSchema = new mongoose.Schema({
  pondId: { type: String, required: true, index: true },
  pondNumber: { type: Number, required: true, immutable: true },

  pondArea: { type: String, required: true },
  pondAreaUnit: { type: String, required: true, default: "acre" },
  pondDepth: { type: String, required: true },
  pondImage: { type: String, required: true },

  overflow: { type: String, required: true },
  receivesSunlight: { type: String, required: true },
  treesOnBanks: { type: String, required: true },
  neighbourhood: { type: String, required: true },
  wastewaterEnters: { type: String, required: true },

  species: { type: String, required: true },
  dateOfStocking: { type: Date, required: true },
  qtySeedInitially: { type: String, required: true },
  currentQty: { type: String, required: true },
  avgSize: { type: String, required: true },

  feedType: { type: String, required: true },
  feedOther: { type: String, required: true },
  feedFreq: { type: String, required: true },
  feedQtyPerDay: { type: String, required: true },
  feedTime: { type: String, required: true },
  recentFeedChanges: { type: String, required: true },
  reducedAppetite: { type: String, required: true },

  waterTemperature: { type: String, required: true },
  pH: { type: String, required: true },
  DO: { type: String, required: true },
  ammoniaLevel: { type: String, required: true },
  phytoplanktonLevel: { type: String, required: true },
  waterHardness: { type: String, required: true },
  algaeBloom: { type: String, required: true },
  pondWaterColor: { type: String, required: true },
  sourceOfWater: { type: String, required: true },

  diseaseSymptoms: { type: String, required: true },
  symptomsObserved: { type: String, required: true },
  fishDeaths: { type: String, required: true },
  symptomsAffect: { type: String, required: true },

  farmObservedDate: { type: Date, required: true },
  farmObservedTime: { type: String, required: true },

  lastSpecies: { type: String, required: true },
  lastHarvestComplete: { type: String, required: true },
  recentRainFlood: { type: String, required: true },
  pesticideRunoff: { type: String, required: true },
  constructionNear: { type: String, required: true },
  suddenTempChange: { type: String, required: true },

  notes: { type: String, required: true },

  pondFiles: { type: [String], required: true },
  fishFiles: { type: [String], required: true },

  updatedAt: { type: Date, default: Date.now, required: true },
  createdAt: { type: Date, default: Date.now, required: true }
}, { _id: false });

/* ===============================
   FARMER UPDATE LOG SCHEMA
================================ */
const farmerUpdateSchema = new mongoose.Schema({
  snapshot: { type: Object, required: true },
  changes: { type: Object, required: true },
  pondFiles: { type: [String], required: true },
  fishFiles: { type: [String], required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, required: true }
}, { _id: false });

/* ===============================
   FARMER SCHEMA
================================ */
const farmerSchema = new mongoose.Schema({
  farmerId: { type: String, unique: true, required: true },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  /* Farmer Basic Details */
  name: { type: String, required: true },
  contact: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  adhar: { type: String, required: true },
  familyMembers: { type: String, required: true },
  familyOccupation: { type: String, required: true },
  village: { type: String, required: true },

  pondCount: { type: Number, default: 0, required: true },
  photo: { type: String, required: true },

  /* PONDS ARRAY */
  ponds: { type: [PondSchema], required: true },

  /* Farmer level files */
  pondFiles: { type: [String], required: true },
  fishFiles: { type: [String], required: true },

  /* Update history */
  updates: { type: [farmerUpdateSchema], required: true }

}, { timestamps: true });

/* ===============================
   AUTO FARMER ID GENERATION
================================ */
farmerSchema.pre("save", async function () {
  if (this.farmerId) return;

  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { id: "farmer" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const serial = String(counter.seq).padStart(5, "0");
  this.farmerId = `FAR-${year}-${serial}`;
});

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
