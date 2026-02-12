// // import User from "../models/userModel.js";
// // import bcrypt from "bcryptjs";

// // export const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ message: "Invalid credentials" });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Invalid credentials" });
// //     }

// //     res.status(200).json({ message: "Login successful", user });

// //   } catch (error) {
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };



// import User from "../models/userModel.js";
// import bcrypt from "bcryptjs";

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // ⭐⭐ MOST IMPORTANT LOGIC
//     const isFirstLogin = user.lastLogin === null;

//     // update lastLogin AFTER checking
//     user.lastLogin = new Date();
//     await user.save();

//     res.status(200).json({
//       message: "Login successful",
//       user,
//       isFirstLogin,   // ⭐⭐ SEND TO FRONTEND
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };










//niche vala dubara login na karna pade 



// import User from "../models/userModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // ⭐ JWT TOKEN CREATE
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES || "7d" }
//     );

//     // ⭐ lastLogin update
//     user.lastLogin = new Date();
//     await user.save();

//     // ❌ password remove
//     const userData = user.toObject();
//     delete userData.password;

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: userData,
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: "Server Error",
//       error: err.message,
//     });
//   }
// };



//ye uper vala bilkul sahi hai 





















import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ⭐ JWT TOKEN GENERATION
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ⭐ lastLogin update
    user.lastLogin = new Date();
    await user.save();

    // ❌ password remove from response
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};