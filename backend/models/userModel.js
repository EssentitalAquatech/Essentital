



// import mongoose from "mongoose";


// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     mobile: String,
//     email: String,
//     age: Number,
//     address: String,

//     role: { type: String, default: "agent" },

//     // ⭐ IMAGE BUFFER FIELDS
//     profilePic: {
//       data: Buffer,
//       contentType: String,
//     },

//     aadharFront: {
//       data: Buffer,
//       contentType: String,
//     },

//     aadharBack: {
//       data: Buffer,
//       contentType: String,
//     },

//     panCard: {
//       data: Buffer,
//       contentType: String,
//     },

//     savingAccountImage: {
//       data: Buffer,
//       contentType: String,
//     },

//     accountNumber: String,
//     ifsc: String,

//     password: String,

//     // ⭐ NEW FIELD (IMPORTANT)
//     lastLogin: {
//       type: Date,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );





// export default mongoose.model("User", userSchema);



import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  age: Number,
  address: String,
  role: { type: String, default: "agent" },
  profilePic: { data: Buffer, contentType: String },
  aadharFront: { data: Buffer, contentType: String },
  aadharBack: { data: Buffer, contentType: String },
  panCard: { data: Buffer, contentType: String },
  savingAccountImage: { data: Buffer, contentType: String },
  accountNumber: String,
  ifsc: String,
  password: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);



