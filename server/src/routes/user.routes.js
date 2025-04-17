const express = require('express');
const router = express.Router();
const { registerUser, verifyOtp, getUserAccounts, addBankAccount, addCreditCard, addTransaction, getRecentTransactions, getMonthlyStats } = require('../controllers/user.controller');
const { isUser } = require('../middlewares/auth.middleware');

// POST /api/users/register
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.get('/accounts/:id', isUser, getUserAccounts);
router.post('/bank-accounts', isUser, addBankAccount);
router.post('/credit-cards', isUser, addCreditCard);
router.post('/transactions', isUser, addTransaction);
router.get('/transactions/recent', isUser, getRecentTransactions);
router.get('/transactions/monthly-stats', isUser, getMonthlyStats);

module.exports = router;