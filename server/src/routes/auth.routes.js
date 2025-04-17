const express = require('express');
const router = express.Router();

const { loginUser, forgotPassword, requestPasswordReset, verifyResetOtp, logoutUser, getUser } = require('../controllers/auth.controller');
const { isUser } = require('../middlewares/auth.middleware');

router.post('/login', loginUser);
router.get('/profile', isUser, getUser);
router.post('/forgot-password', isUser, forgotPassword);
router.post('/request-reset', requestPasswordReset);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/logout', logoutUser);

module.exports = router;