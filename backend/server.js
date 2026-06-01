// ============================================================
// server.js — SuitingStudio Backend Entry Point
// ============================================================
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// ── Load .env using ABSOLUTE path so it works from any directory ──
// This fixes "MONGO_URI is undefined" when running nodemon
dotenv.config({ path: path.resolve(__dirname, '.env') });

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// ── Debug: confirm env loaded (remove after confirming it works) ──
console.log('🔍 ENV check → PORT:', process.env.PORT, '| MONGO_URI set:', !!process.env.MONGO_URI);

// Connect MongoDB
connectDB();

const app = express();

// ── Security Middleware ───────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// ── Body Parsers ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logger (development only) ─────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Static Files (local image uploads) ───────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/admin',      require('./routes/adminRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/upload',     require('./routes/uploadRoutes'));

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SuitingStudio API Running ✅',
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// ── 404 & Error Handlers ──────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SuitingStudio API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
});