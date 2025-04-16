const express = require('express');
const router = express.Router();
const {isUser} = require('../middlewares/auth.middleware');

const {registerUser, verifyOtp, getUserAccounts, addBankAccounts, addCreditCard,addTransaction} = require('../controllers/user.controller');

router.post('/register', registerUser); // Register a new user and send OTP
router.post('/verify-otp', verifyOtp); // Verify OTP and register the user
router.get('/accounts',isUser ,getUserAccounts); // Get user accounts
router.post('/addbank',isUser, addBankAccounts)
router.post('/addcreditCard',isUser, addCreditCard)
router.post('/addTransaction',isUser, addTransaction)


module.exports = router;