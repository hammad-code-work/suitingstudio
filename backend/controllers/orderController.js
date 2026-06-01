// controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderNotificationToAdmin, sendOrderConfirmationToCustomer } = require('../utils/sendEmail');

// ── Lazy-load Stripe so missing key doesn't crash startup ──
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_')) {
    return null;
  }
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// @desc   Create Stripe Payment Intent
// @route  POST /api/orders/payment-intent
// @access Public
const createPaymentIntent = asyncHandler(async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(400);
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to .env');
  }
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  });
  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc   Create new order
// @route  POST /api/orders
// @access Public (guests + logged-in users)
const createOrder = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    orderItems,
    paymentMethod,
    stripePaymentIntentId,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // ── Validate stock & build order items ──────────────────
  let subtotal = 0;
  const validatedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.title}". Available: ${product.stock}`);
    }

    const price = product.discountPrice || product.originalPrice;
    subtotal += price * item.quantity;

    validatedItems.push({
      product: product._id,
      title: product.title,
      image: product.images[0]?.url || '',
      size: item.size,
      color: item.color || '',
      quantity: item.quantity,
      price,
    });

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();
  }

  const shippingCost = subtotal > 100 ? 0 : 10;
  const totalAmount = subtotal + shippingCost;

  // ── Create order ─────────────────────────────────────────
  const order = await Order.create({
    user: req.user?._id || null,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    orderItems: validatedItems,
    subtotal,
    shippingCost,
    totalAmount,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: stripePaymentIntentId ? 'paid' : 'pending',
    stripePaymentIntentId: stripePaymentIntentId || '',
  });

  // ── Send notification emails (non-blocking) ───────────────
  try {
    await sendOrderNotificationToAdmin(order);
    await sendOrderConfirmationToCustomer(order);
  } catch (emailErr) {
    // Don't fail the order if email fails
    console.error('⚠️  Email notification failed:', emailErr.message);
  }

  res.status(201).json({ success: true, order });
});

// @desc   Get logged-in user's orders
// @route  GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc   Get single order by ID
// @route  GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  // Only admin or the order owner can view
  const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
  if (!req.user.isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, order });
});

module.exports = { createOrder, createPaymentIntent, getMyOrders, getOrderById };
