const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { sendOtp } = require("../services/otp.services");


exports.loginUser = async (req, res) => {
    const { emailOrNumber, password } = req.body;
    console.log("Email :" , emailOrNumber)
    console.log("password :" , password)

    if(!emailOrNumber || !password ){
      return res.status(401).json({message : "Please enter all field"})
    }

    try {
        const user = await User.findOne(
            { $or: [{ email: emailOrNumber }, { number: emailOrNumber }] }
        );
        if (!user) return res.status(401).json({ message: "User not found" });

        // if(!user.isVerified) return res.status(401).json({ message: "Ohh! User is not Approved by Admin, Please wait" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // if (!user.isVerified) return res.status(401).json({ message: "User not verified or may be blocked" });

        const token = generateToken(user._id, user.role || "user",  {
          expiresIn: "1d", // or "10m", "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
            sameSite: "strict", // Helps prevent CSRF attacks
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user : {
                id: user._id,
                name: user.name,
                email: user.email,
                number : user.number,
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getUser = async(req,res)=>{
  try {
    const userId = req.user.id; // Only allow for authenticated users
    
    const user = await User.findById(userId)

    if(user){
      console.log("user :", user);
      return res.status(200).json({message : "user found scucces"})
    } else {
      return res.status(401).json({message : "user not found scucces"})
    }
    
  } catch (error) {
    console.log("server error",error);
    res.status(401).json({message : "Server error from getuser"})
    
  }
}

exports.requestPasswordReset = async (req, res) => {
    try {
        const { emailOrNumber } = req.body;
        const user = await User.findOne(
            { $or: [{ email: emailOrNumber }, { number: emailOrNumber }] }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.isVerified) return res.status(401).json({ message: "User not verified or may be blocked" });

        // Generate OTP and send it to the user via email or SMS
        res.cookie("user", user, {
            maxAge: 15 * 60 * 1000, // 15 minutes
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "strict",
        });
        await sendOtp(user);

        return res.status(200).json({ message: "OTP sent successfully. Please verify." });

    } catch (error) {
        console.log("Request Password Reset Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

exports.verifyResetOtp = async (req, res) => {
    try {
      const { otp, newPassword } = req.body;
      const userFromCookie = req.cookies.user;
  
      if (!userFromCookie || !otp || !newPassword) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const user = await User.findById(userFromCookie._id).select("+otp +otpExpire +password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (!user.isVerified) {
        return res.status(401).json({ message: "User not verified or may be blocked" });
      }
  
      if (user.otp !== otp || user.otpExpire < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "New password cannot be the same as the old password" });
      }
  
      // Update the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.otp = undefined;
      user.otpExpire = undefined;
  
      await user.save();
  
      // Clear the cookie after successful password reset
      res.clearCookie("user");
  
      return res.status(200).json({ message: "Password reset successful." });
  
    } catch (error) {
      console.error("Verify Reset OTP Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

exports.forgotPassword = async (req, res) => {
    try {
      const userId = req.user?.id; // Only allow for authenticated users
      const { password: newPassword } = req.body;
  
      if (!userId) {
        return res.status(400).json({ message: "Invalid request. User ID missing." });
      }
  
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
      }
  
      const user = await User.findById(userId).select('+password'); // Include password field if schema has select: false
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (!user.isVerified) {
        return res.status(401).json({ message: "User not verified or may be blocked." });
      }
  
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "New password cannot be the same as the old password." });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      return res.status(200).json({
        message: "Password updated successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          number: user.number,
        }
      });
  
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        // Clear the cookie set during login
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Should match login cookie
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
