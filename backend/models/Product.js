// models/Product.js — Full Product Schema for SuitingStudio
const mongoose = require('mongoose');

// Sub-schema for product reviews
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: '' }, // for Cloudinary
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ['Women', 'Kids'], // Only Women & Kids
    },
    // Women sizes: XS S M L XL XXL
    // Kids sizes: 1-2 Years, 3-4 Years etc.
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null, // null means no discount
      min: 0,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      unique: true,
      uppercase: true,
    },
    reviews: [reviewSchema],
    numReviews: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    tags: [{ type: String, lowercase: true }],
  },
  { timestamps: true }
);

// Auto-generate slug from title
productSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  // Calculate average rating
  if (this.reviews.length > 0) {
    this.rating =
      this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

// Index for search performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
