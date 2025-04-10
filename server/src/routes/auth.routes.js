const express = require('express');
const router = express.Router();

const { loginUser, forgotPassword, requestPasswordReset, verifyResetOtp, logoutUser  } = require('../controllers/auth.controller');
const { isUser } = require('../middlewares/auth.middleware');

router.post('/login', loginUser); // User login
router.put('/forgot-password',isUser, forgotPassword); // User forgot password
router.post('/request-reset', requestPasswordReset); // Request password reset if user not logged in
router.put('/verify-reset-otp', verifyResetOtp);
router.post('/logout', logoutUser); // User logout

module.exports = router;