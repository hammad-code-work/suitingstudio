// controllers/adminController.js — Admin Panel Controller
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc   Get dashboard statistics
// @route  GET /api/admin/stats
// @access Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments({ isAdmin: false });

  // Revenue from paid orders
  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('customerName totalAmount orderStatus createdAt');

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      ordersByStatus,
      recentOrders,
      monthlyRevenue,
    },
  });
});

// @desc   Get all orders (admin)
// @route  GET /api/admin/orders
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.limit) || 20;
  const filter = {};

  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

  const count = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('user', 'name email');

  res.json({ success: true, orders, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc   Update order status (admin)
// @route  PUT /api/admin/orders/:id/status
// @access Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, trackingNumber, adminNotes } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = orderStatus || order.orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (adminNotes) order.adminNotes = adminNotes;

  // If shipped, mark payment as paid for COD
  if (orderStatus === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }

  await order.save();
  res.json({ success: true, order });
});

// @desc   Get all users (admin)
// @route  GET /api/admin/users
// @access Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false }).sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// @desc   Delete user (admin)
// @route  DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

module.exports = { getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers, deleteUser };
