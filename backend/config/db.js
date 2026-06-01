// config/db.js — MongoDB Atlas Connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose 8+ no longer needs useNewUrlParser / useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Check your MONGO_URI in backend/.env');
    process.exit(1);
  }
};

module.exports = connectDB;