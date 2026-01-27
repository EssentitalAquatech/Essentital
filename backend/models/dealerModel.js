

// import mongoose from "mongoose";

// // ------------------------------
// // ⭐ Dealer Update History Schema
// // ------------------------------
// const dealerUpdateSchema = new mongoose.Schema(
//   {
//     snapshot: Object,       // Old data ka pura backup
//     changes: Object,        // ✅ Field-wise changes
//     image: String,          // Old image
//     createdAt: { type: Date, default: Date.now }
//   },
//   { _id: false }
// );

// // ------------------------------
// // ⭐ Main Dealer Schema
// // ------------------------------
// const dealerSchema = new mongoose.Schema({
  
//   // Basic Required Fields
//   name: { type: String, required: true },
//   contact: { type: String, required: true },
  
//   // Updated Fields (ISDN → GST Number)
//   // gstNumber: { type: String }, // ✅ ISDN se change hua
//   gstNumber: { type: String, required: true },


//   // Updated / New Field
//   shopAddress: { type: String, required: true },

//   // Image Path
//   image: { type: String, required: true },

//   // User Who Created The Dealer
//   createdBy: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },

//   // ⭐ History Updates
//   updates: [dealerUpdateSchema],

//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Dealer", dealerSchema);











//buffer model -
import mongoose from "mongoose";

// ------------------------------
// ⭐ Dealer Update History Schema
// ------------------------------
const dealerUpdateSchema = new mongoose.Schema(
  {
    snapshot: {
      type: Object,
      required: true
    },

    changes: {
      type: Object,
      required: true
    },

    image: {
      data: Buffer,
      contentType: String
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

// ------------------------------
// ⭐ Main Dealer Schema
// ------------------------------
const dealerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    contact: {
      type: String,
      required: true,
      trim: true
    },

    gstNumber: {
      type: String,
      required: true,
      trim: true
    },

    shopAddress: {
      type: String,
      required: true,
      trim: true
    },

    // ⭐ IMAGE STORED AS BUFFER
    image: {
      data: {
        type: Buffer,
        required: true
      },
      contentType: {
        type: String,
        required: true
      }
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    updates: [dealerUpdateSchema]
  },
  {
    timestamps: true // createdAt + updatedAt auto
  }
);

export default mongoose.model("Dealer", dealerSchema);
