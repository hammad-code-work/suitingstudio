// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes protected
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
