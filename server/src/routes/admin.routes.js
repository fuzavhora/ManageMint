const express = require('express');
const router = express.Router();
const { loginAdmin, getPendingUsers, verifyUser, rejectUser, getAllUsers, getRejectedUsers, logoutAdmin } = require('../controllers/admin.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

//POST /api/admin/login
router.post('/login', loginAdmin);
router.get('/get-users', isAdmin, getAllUsers);
router.get('/pending-users', isAdmin, getPendingUsers);
router.put('/verify-user/:id', isAdmin, verifyUser);
router.delete('/reject-user/:id', isAdmin, rejectUser);
router.get('/rejected-users', isAdmin, getRejectedUsers);
router.post('/logout', isAdmin, logoutAdmin);

module.exports = router;