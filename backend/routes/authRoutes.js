// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const { register, login, makeAdmin, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',   register);
router.post('/login',      login);
router.post('/make-admin', makeAdmin);   // <-- promote user to admin
router.get('/profile',     protect, getProfile);
router.put('/profile',     protect, updateProfile);

module.exports = router;