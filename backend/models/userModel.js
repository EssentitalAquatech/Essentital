


// import mongoose from "mongoose";


// const userSchema = new mongoose.Schema({
//   name: String,
//   mobile: String,
//   email: String,
//   age: Number,
//   address: String,
//   role: { type: String, default: "agent" },
//   profilePic: { data: Buffer, contentType: String },
//   aadharFront: { data: Buffer, contentType: String },
//   aadharBack: { data: Buffer, contentType: String },
//   panCard: { data: Buffer, contentType: String },
//   savingAccountImage: { data: Buffer, contentType: String },
//   accountNumber: String,
//   ifsc: String,
//   password: String,
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);




//uper vala sahi hai 








import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
 email: { type: String, unique: true },
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



