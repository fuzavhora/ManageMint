const User = require("../models/user.model");
const { sendOtp } = require("../services/otp.services");
const TempUser = require("../models/tempUser");


//Register a new user and send OTP
exports.registerUser = async (req, res) => {
  const { name, email, number, password, gender, age } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const existingTemp = await TempUser.findOne({ email });
    if (existingTemp) await TempUser.deleteOne({ email }); // remove previous attempts

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = Date.now() + 10 * 60 * 1000;

    const tempUser = new TempUser({
      name,
      email,
      number,
      password,
      gender,
      age,
      otp,
      otpExpires
    });

    await tempUser.save();

    await sendOtp(tempUser); // send to mobile and email

    res.status(200).json({ message: "OTP sent successfully. Please verify." });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

//Verify OTP and register the user

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const tempUser = await TempUser.findOne({ otp });

    if (!tempUser) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > tempUser.otpExpires) {
      await TempUser.deleteOne({ _id: tempUser._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Move tempUser to main User collection
    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      number: tempUser.number,
      password: tempUser.password,
      gender: tempUser.gender,
      age: tempUser.age,
  
    });

    await newUser.save();
    await TempUser.deleteOne({ _id: tempUser._id });

    res.status(201).json({ message: "OTP verified & user registered successfully" });

  } catch (error) {
    console.error("OTP verification failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};