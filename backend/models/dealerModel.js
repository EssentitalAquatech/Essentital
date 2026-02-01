
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
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
}
,

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

    // contact: {
    //   type: String,
    //   required: true,
    //   trim: true
    // },

    contact: {
  type: String,
  required: true,
  trim: true,
  match: [
    /^[0-9]{10}$/,
    "Contact number must be exactly 10 digits"
  ]
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







