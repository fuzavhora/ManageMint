const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const User = require('../models/user.model');
const RejectedUser = require('../models/rejectedUser.model');


//Admin Login

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if(!admin) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, admin.password);

        if(!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = generateToken(admin._id, admin.role || 'admin');

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            sameSite: 'strict', // Helps prevent CSRF attacks
        });
        res.status(200).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: token,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error : error.message }); 
    }
}

exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ isVerified: false });
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.verifyUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.rejectUser = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'Reason is required' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rejectedUser = new RejectedUser({
        name: user.name,
        email: user.email,  
        Number: user.number,
        age : user.age,
        gender : user.gender,
        reason: reason,
    })

    await rejectedUser.save();
    if (!rejectedUser) return res.status(500).json({ message: 'Failed to save rejected user' });


    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User rejected and deleted' });
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find({isVerified: true});
    if (!users) return res.status(404).json({ message: 'No users found' });

    res.status(200).json(users);
}

exports.getRejectedUsers = async (req, res) => {
    try {
        const rejectedUsers = await RejectedUser.find();
        res.status(200).json(rejectedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.logoutAdmin = (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
  
      res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
};

