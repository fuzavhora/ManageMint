const express = require('express');
const router = express.Router();
const { registerUser, verifyOtp, getUserAccounts, addBankAccount, addCreditCard, addTransaction, getRecentTransactions, getMonthlyStats ,getallcards} = require('../controllers/user.controller');
const { isUser } = require('../middlewares/auth.middleware');

// POST /api/users/register
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/accounts/:id', isUser, getUserAccounts);
router.post('/bank-accounts', isUser, addBankAccount);
router.post('/credit-cards',isUser,getallcards)
router.post('/add-credit-card', isUser, addCreditCard);
router.post('/transactions', isUser, addTransaction);
router.post('/transactions/recent', isUser, getRecentTransactions);
router.post('/transactions/monthly-stats', isUser, getMonthlyStats);

module.exports = router;