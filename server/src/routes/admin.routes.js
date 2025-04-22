const express = require('express');
const router = express.Router();
const { loginAdmin, getPendingUsers, verifyUser, rejectUser, getAllUsers, getRejectedUsers, logoutAdmin , getAdmin} = require('../controllers/admin.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

//POST /api/admin/login
router.post('/login', loginAdmin);
router.post('/get-users', isAdmin, getAllUsers);
router.post('/verify', isAdmin, getAdmin);
router.post('/pending-users', isAdmin, getPendingUsers);
router.post('/verify-user/:id', isAdmin, verifyUser);
router.post('/reject-user/:id', isAdmin, rejectUser);

router.post('/rejected-users', isAdmin, getRejectedUsers);
router.post('/logout', isAdmin, logoutAdmin);

module.exports = router;