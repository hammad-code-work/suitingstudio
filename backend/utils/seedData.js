// utils/seedData.js — run: node utils/seedData.js  (from backend/ folder)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('\n🔍 ENV check → MONGO_URI set:', !!process.env.MONGO_URI);

if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('REPLACE_THIS') || process.env.MONGO_URI.includes('xxxxx')) {
  console.error('❌ Fix MONGO_URI in backend/.env first!');
  process.exit(1);
}

const mongoose = require('mongoose');
const User     = require('../models/User');
const Category = require('../models/Category');
const Product  = require('../models/Product');
const Order    = require('../models/Order');

const seed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected:', mongoose.connection.host);

    // Clear all
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Collections cleared');

    // ── Create admin using PLAIN password ─────────────────────
    // Let the pre('save') hook hash it naturally — do NOT pre-hash
    const admin = new User({
      name:    'SuitingStudio Admin',
      email:   'admin@suitingstudio.com',
      password: 'Admin@12345',   // plain text — hook will hash this
      isAdmin: true,
    });
    await admin.save();  // triggers pre('save') → hashes password

    console.log('\n✅ Admin created:');
    console.log('   Email   : admin@suitingstudio.com');
    console.log('   Password: Admin@12345');
    console.log('   isAdmin :', admin.isAdmin);

    // Verify it was saved and password hashed correctly
    const bcrypt    = require('bcryptjs');
    const savedUser = await User.findOne({ email: 'admin@suitingstudio.com' }).select('+password');
    const isMatch   = await bcrypt.compare('Admin@12345', savedUser.password);
    console.log('🔐 Password hash test:', isMatch ? '✅ PASS' : '❌ FAIL');

    if (!isMatch) {
      throw new Error('Password hash verification failed. Check User model pre-save hook.');
    }

    // Categories
    await Category.create({ name: 'Women', description: 'Premium women garments' });
    await Category.create({ name: 'Kids',  description: 'Comfortable kids garments' });
    console.log('✅ Categories: Women, Kids');

    // Products
    const products = [
      {
        title: 'Elegant Floral Dress',
        description: 'Beautiful floral summer dress, perfect for casual and semi-formal occasions.',
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'White'],
        stock: 50, originalPrice: 89, discountPrice: 65,
        isOnSale: true, isFeatured: true, sku: 'WD-001',
        rating: 4.5, numReviews: 28,
        images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80' }],
        tags: ['dress', 'floral', 'summer', 'women'],
      },
      {
        title: 'Classic Women Formal Suit',
        description: 'Professional women suit tailored to perfection for formal occasions.',
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Beige'],
        stock: 30, originalPrice: 149,
        isOnSale: false, isFeatured: true, sku: 'WS-002',
        rating: 4.8, numReviews: 15,
        images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4ac7?w=400&q=80' }],
        tags: ['suit', 'formal', 'women'],
      },
      {
        title: 'Women Embroidered Kurti',
        description: 'Hand-embroidered kurti with intricate detailing. Premium fabric.',
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Cream', 'Maroon', 'Forest Green'],
        stock: 25, originalPrice: 75, discountPrice: 59,
        isOnSale: true, isFeatured: true, sku: 'WK-003',
        rating: 4.6, numReviews: 33,
        images: [{ url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80' }],
        tags: ['kurti', 'embroidered', 'women'],
      },
      {
        title: 'Kids Party Dress',
        description: 'Adorable party dress for little girls. Soft fabric, comfortable fit.',
        category: 'Kids',
        sizes: ['1-2 Years', '3-4 Years', '5-6 Years', '7-8 Years'],
        colors: ['Pink', 'Yellow', 'Purple'],
        stock: 40, originalPrice: 45, discountPrice: 35,
        isOnSale: true, isFeatured: true, sku: 'KD-001',
        rating: 4.7, numReviews: 22,
        images: [{ url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80' }],
        tags: ['dress', 'party', 'kids'],
      },
      {
        title: 'Kids Casual Comfort Set',
        description: 'Comfortable and stylish casual wear set for kids.',
        category: 'Kids',
        sizes: ['3-4 Years', '5-6 Years', '7-8 Years', '9-10 Years', '11-12 Years'],
        colors: ['Blue', 'Grey', 'Green'],
        stock: 60, originalPrice: 35,
        isOnSale: false, isFeatured: false, sku: 'KC-002',
        rating: 4.3, numReviews: 10,
        images: [{ url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80' }],
        tags: ['casual', 'kids'],
      },
      {
        title: 'Kids Winter Sherpa Jacket',
        description: 'Warm and cozy sherpa jacket for kids. Double-lined for maximum warmth.',
        category: 'Kids',
        sizes: ['3-4 Years', '5-6 Years', '7-8 Years', '9-10 Years', '11-12 Years'],
        colors: ['Camel', 'Grey', 'Navy'],
        stock: 45, originalPrice: 55, discountPrice: 42,
        isOnSale: true, isFeatured: true, sku: 'KJ-003',
        rating: 4.9, numReviews: 31,
        images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80' }],
        tags: ['jacket', 'winter', 'kids'],
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    console.log('\n🎉 ===================================');
    console.log('   SEED COMPLETE!');
    console.log('   Admin URL  : http://localhost:3000/admin/login');
    console.log('   Email      : admin@suitingstudio.com');
    console.log('   Password   : Admin@12345');
    console.log('=====================================\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Seed error:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();