const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { use } = require("../routes/user.routes");

exports.loginUser = async (req, res) => {
    const { emailOrNumber, password } = req.body;

    try {
        const user = await User.findOne(
            { $or: [{ email: emailOrNumber }, { number: emailOrNumber }] }
        );
        if (!user || !user.isVerified) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        if (!user.isVerified) return res.status(401).json({ message: "User not verified or may be blocked" });

        const token = generateToken(user._id, user.role || "user");

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