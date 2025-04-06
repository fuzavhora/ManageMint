const express = require('express');
const router = express.Router();
const { loginAdmin , getPendingUsers, verifyUser, rejectUser, getAllUsers, getRejectedUsers } = require('../controllers/admin.controller');
const {  isAdmin } = require('../middlewares/auth.middleware');
//POST /api/admin/login
router.post('/login', loginAdmin);
router.get('/get-users',isAdmin(), getAllUsers);
router.get('/pending-users', getPendingUsers);
router.put('/verify-user/:userId', verifyUser);
router.delete('/reject-user/:id', rejectUser);
router.get('/rejected-users', getRejectedUsers)



module.exports = router;