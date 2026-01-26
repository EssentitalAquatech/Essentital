


// import User from "../models/userModel.js";
// import bcrypt from "bcryptjs";
// import fs from "fs";

// /* =========================
//    SIGNUP CONTROLLER
// ========================= */
// export const signup = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       mobile,
//       age,
//       address,
//       accountNumber,
//       ifsc,
//     } = req.body;

//     // ❌ Check required fields
//     if (!name || !email || !password || !mobile) {
//       return res.status(400).json({ message: "All required fields missing" });
//     }

//     // ❌ Check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Helper function to convert image to buffer
//     const getFileBuffer = (file) => {
//       if (!file) return null;
//       return {
//         data: fs.readFileSync(file.path),
//         contentType: file.mimetype,
//       };
//     };

//     // ✅ Create user
//     const user = new User({
//       name,
//       email,
//       mobile,
//       age,
//       address,
//       accountNumber,
//       ifsc,
//       password: hashedPassword,

//       profilePic: getFileBuffer(req.files?.profile?.[0]),
// // photo: req.files?.profile?.[0]
// //   ? `/uploads/${req.files.profile[0].filename}`
// //   : null,



//       aadharFront: getFileBuffer(req.files?.aadharFront?.[0]),
//       aadharBack: getFileBuffer(req.files?.aadharBack?.[0]),
//       panCard: getFileBuffer(req.files?.pan?.[0]),
//       savingAccountImage: getFileBuffer(req.files?.savingImg?.[0]),
//     });

//     await user.save();

//     // ❌ remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.status(201).json({
//       message: "Signup successful",
//       user: userResponse,
//     });

//   } catch (error) {
//     console.error("SIGNUP ERROR 🔥", error);
//     res.status(500).json({
//       message: "Signup failed",
//       error: error.message,
//     });
//   }
// };






//uper vala sahi hai








// controllers/userController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

/* =========================
   SIGNUP CONTROLLER
========================= */
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      age,
      address,
      accountNumber,
      ifsc,
    } = req.body;

    console.log("Signup Request Body:", req.body);
    console.log("Signup Request Files:", req.files);

    // ❌ Check required fields
    const requiredFields = ["name", "email", "password", "mobile", "age", "address", "accountNumber", "ifsc"];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: "Missing required fields", 
        missingFields 
      });
    }

    // ❌ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Helper function to convert image to buffer
    const getFileBuffer = (file) => {
      if (!file) return null;
      try {
        const filePath = path.join(process.cwd(), file.path);
        return {
          data: fs.readFileSync(filePath),
          contentType: file.mimetype,
        };
      } catch (error) {
        console.error(`Error reading file ${file.path}:`, error);
        return null;
      }
    };

    // ✅ Get file buffers
    const profilePic = req.files?.profile?.[0] ? getFileBuffer(req.files.profile[0]) : null;
    const aadharFront = req.files?.aadharFront?.[0] ? getFileBuffer(req.files.aadharFront[0]) : null;
    const aadharBack = req.files?.aadharBack?.[0] ? getFileBuffer(req.files.aadharBack[0]) : null;
    const panCard = req.files?.pan?.[0] ? getFileBuffer(req.files.pan[0]) : null;
    const savingAccountImage = req.files?.savingImg?.[0] ? getFileBuffer(req.files.savingImg[0]) : null;

    // ✅ Create user
    const user = new User({
      name,
      email,
      mobile,
      age: parseInt(age),
      address,
      accountNumber,
      ifsc,
      password: hashedPassword,
      profilePic,
      aadharFront,
      aadharBack,
      panCard,
      savingAccountImage,
    });

    await user.save();

    // ❌ Delete temporary files
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error(`Error deleting temp file ${file.path}:`, error);
          }
        });
      });
    }

    // ❌ Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.profilePic?.data;
    delete userResponse.aadharFront?.data;
    delete userResponse.aadharBack?.data;
    delete userResponse.panCard?.data;
    delete userResponse.savingAccountImage?.data;

    res.status(201).json({
      message: "Signup successful",
      user: userResponse,
    });

  } catch (error) {
    console.error("SIGNUP ERROR 🔥", error);
    
    // Delete any uploaded files if error occurred
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (err) {
            console.error(`Error cleaning up file ${file.path}:`, err);
          }
        });
      });
    }
    
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};