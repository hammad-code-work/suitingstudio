// controllers/adminController.js
const asyncHandler = require('express-async-handler');
const Order        = require('../models/Order');
const Product      = require('../models/Product');
const User         = require('../models/User');
const mongoose     = require('mongoose');

// GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders   = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers    = await User.countDocuments({ isAdmin: false });
  const rev = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
  const totalRevenue   = rev[0]?.total || 0;
  const ordersByStatus = await Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]);
  const recentOrders   = await Order.find().sort({ createdAt: -1 }).limit(5).select('customerName totalAmount orderStatus createdAt');
  const sixMonthsAgo   = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  res.json({ success: true, stats: { totalOrders, totalProducts, totalUsers, totalRevenue, ordersByStatus, recentOrders, monthlyRevenue } });
});

// GET /api/admin/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.limit) || 20;
  const filter = {};
  if (req.query.status)        filter.orderStatus   = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  const count  = await Order.countDocuments(filter);
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1)).populate('user', 'name email');
  res.json({ success: true, orders, page, pages: Math.ceil(count / pageSize), total: count });
});

// PUT /api/admin/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const { orderStatus, trackingNumber, adminNotes } = req.body;
  if (orderStatus)                  order.orderStatus    = orderStatus;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (adminNotes     !== undefined) order.adminNotes     = adminNotes;
  if (orderStatus === 'delivered' && order.paymentMethod === 'cod') order.paymentStatus = 'paid';
  await order.save();
  res.json({ success: true, order });
});

// DELETE /api/admin/orders/:id
const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  console.log('DELETE order:', orderId);

  let deleted = false;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (order) deleted = true;
  } catch (e) {
    console.log('Mongoose delete error:', e.message);
  }

  if (!deleted) {
    try {
      const result = await mongoose.connection.db
        .collection('orders')
        .deleteOne({ _id: new mongoose.Types.ObjectId(orderId) });
      if (result.deletedCount > 0) deleted = true;
    } catch (e) {
      console.log('Raw delete error:', e.message);
    }
  }

  if (!deleted) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({ success: true, message: 'Order deleted' });
});

// GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false }).sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAllUsers,
  deleteUser,
};