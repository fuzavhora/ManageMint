const express = require('express');
const router = express.Router();

const {registerUser, verifyOtp} = require('../controllers/user.controller');

router.post('/register', registerUser); // Register a new user and send OTP
router.post('/verify-otp', verifyOtp); // Verify OTP and register the user


module.exports = router;