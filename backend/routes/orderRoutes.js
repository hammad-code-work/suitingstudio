// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, createPaymentIntent, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createOrder); // public – guests can order
router.post('/payment-intent', createPaymentIntent);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
