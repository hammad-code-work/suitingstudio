// controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc   Get all products with filters
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  // Build filter object
  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.isOnSale === 'true') filter.isOnSale = true;
  if (req.query.isFeatured === 'true') filter.isFeatured = true;

  // Size filter
  if (req.query.size) filter.sizes = { $in: [req.query.size] };

  // Color filter
  if (req.query.color) filter.colors = { $in: [req.query.color] };

  // Price range
  if (req.query.minPrice || req.query.maxPrice) {
    filter.originalPrice = {};
    if (req.query.minPrice) filter.originalPrice.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.originalPrice.$lte = Number(req.query.maxPrice);
  }

  // Text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Sort
  let sort = { createdAt: -1 }; // newest first by default
  if (req.query.sort === 'price_asc') sort = { originalPrice: 1 };
  if (req.query.sort === 'price_desc') sort = { originalPrice: -1 };
  if (req.query.sort === 'rating') sort = { rating: -1 };
  if (req.query.sort === 'newest') sort = { createdAt: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc   Get single product by id or slug
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null }, { slug: req.params.id }],
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// @desc   Create product (admin)
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    title, description, category, sizes, colors, stock,
    originalPrice, discountPrice, isOnSale, isFeatured, sku, tags,
  } = req.body;

  // Handle uploaded images
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((f) => ({ url: `/uploads/${f.filename}` }));
  } else if (req.body.images) {
    images = typeof req.body.images === 'string'
      ? JSON.parse(req.body.images)
      : req.body.images;
  }

  const product = await Product.create({
    title, description, category,
    sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
    colors: typeof colors === 'string' ? JSON.parse(colors) : colors,
    stock, originalPrice, discountPrice, isOnSale, isFeatured, sku,
    tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
    images,
  });

  res.status(201).json({ success: true, product });
});

// @desc   Update product (admin)
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = [
    'title','description','category','stock','originalPrice',
    'discountPrice','isOnSale','isFeatured','sku',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  if (req.body.sizes) product.sizes = typeof req.body.sizes === 'string' ? JSON.parse(req.body.sizes) : req.body.sizes;
  if (req.body.colors) product.colors = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors) : req.body.colors;
  if (req.body.tags) product.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({ url: `/uploads/${f.filename}` }));
    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc   Delete product (admin)
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, message: 'Product deleted' });
});

// @desc   Add review to product
// @route  POST /api/products/:id/reviews
// @access Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview };
