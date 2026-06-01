// controllers/authController.js
const asyncHandler  = require('express-async-handler');
const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  res.status(201).json({
    success: true,
    _id:     user._id,
    name:    user.name,
    email:   user.email,
    isAdmin: user.isAdmin,
    token:   generateToken(user._id),
  });
});

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  console.log(`✅ Login → ${user.email} | isAdmin: ${user.isAdmin} | _id: ${user._id}`);

  res.json({
    success: true,
    _id:     user._id,
    name:    user.name,
    email:   user.email,
    isAdmin: user.isAdmin,
    token:   generateToken(user._id),
  });
});

// @desc   TEMP: Promote any user to admin using ADMIN_SECRET_KEY
// @route  POST /api/auth/make-admin
// @access Public (protected by secret key)
const makeAdmin = asyncHandler(async (req, res) => {
  const { email, secretKey } = req.body;

  // Validate secret key from .env
  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    res.status(403);
    throw new Error('Invalid secret key');
  }

  // Use raw MongoDB to bypass ALL Mongoose middleware
  const mongoose = require('mongoose');
  const result = await mongoose.connection.db
    .collection('users')
    .findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { isAdmin: true, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

  // Handle both old and new mongoose driver response formats
  const updatedUser = result?.value || result;

  if (!updatedUser) {
    res.status(404);
    throw new Error(`No user found with email: ${email}`);
  }

  console.log(`✅ Promoted to admin: ${updatedUser.email} | isAdmin: ${updatedUser.isAdmin}`);

  res.json({
    success:  true,
    message:  `${email} is now an admin`,
    email:    updatedUser.email,
    isAdmin:  updatedUser.isAdmin,
  });
});

// @desc   Get logged-in user profile
// @route  GET /api/auth/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  user.name  = req.body.name  || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  if (req.body.address)  user.address  = { ...user.address, ...req.body.address };
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();

  res.json({
    success: true,
    _id:     updated._id,
    name:    updated.name,
    email:   updated.email,
    isAdmin: updated.isAdmin,
    token:   generateToken(updated._id),
  });
});

module.exports = { register, login, makeAdmin, getProfile, updateProfile };