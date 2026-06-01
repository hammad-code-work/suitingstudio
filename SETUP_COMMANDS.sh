#!/bin/bash
# ============================================================
# SuitingStudio - Complete MERN Setup Commands
# Run each block in Git Bash from your desired project folder
# ============================================================

# ── STEP 1: Create root project folder ──────────────────────
mkdir suitingstudio && cd suitingstudio
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# ── STEP 2: Create backend structure ────────────────────────
mkdir backend
cd backend
npm init -y

# Install backend dependencies
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer \
  cloudinary multer-storage-cloudinary stripe nodemailer \
  express-async-handler morgan helmet express-rate-limit

npm install --save-dev nodemon

# Create backend folder structure
mkdir -p config controllers middleware models routes uploads utils

# Create all backend files (placeholders — filled by code below)
touch config/db.js config/cloudinary.js
touch controllers/authController.js controllers/productController.js \
      controllers/orderController.js controllers/adminController.js \
      controllers/categoryController.js
touch middleware/authMiddleware.js middleware/adminMiddleware.js \
      middleware/uploadMiddleware.js middleware/errorMiddleware.js
touch models/User.js models/Product.js models/Order.js models/Category.js
touch routes/authRoutes.js routes/productRoutes.js routes/orderRoutes.js \
      routes/adminRoutes.js routes/categoryRoutes.js routes/uploadRoutes.js
touch utils/sendEmail.js utils/generateToken.js utils/apiFeatures.js
touch server.js .env

cd ..

# ── STEP 3: Create frontend structure ───────────────────────
npx create-react-app frontend --template cra-template
cd frontend

# Install frontend dependencies
npm install axios react-router-dom react-toastify react-icons \
  @stripe/stripe-js @stripe/react-stripe-js swiper react-helmet \
  react-loading-skeleton react-range framer-motion

# Create frontend folder structure
mkdir -p src/assets/images
mkdir -p src/components/common
mkdir -p src/components/home
mkdir -p src/components/product
mkdir -p src/components/cart
mkdir -p src/components/checkout
mkdir -p src/components/admin
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/pages/admin
mkdir -p src/routes
mkdir -p src/services

# Create all frontend files
touch src/context/AuthContext.js src/context/CartContext.js \
      src/context/ThemeContext.js

touch src/hooks/useProducts.js src/hooks/useOrders.js \
      src/hooks/useAuth.js src/hooks/useLocalStorage.js

touch src/services/api.js src/services/authService.js \
      src/services/productService.js src/services/orderService.js \
      src/services/adminService.js

touch src/routes/PrivateRoute.js src/routes/AdminRoute.js

# Components - common
touch src/components/common/Navbar.js src/components/common/Footer.js \
      src/components/common/Loader.js src/components/common/SearchBar.js \
      src/components/common/Breadcrumb.js src/components/common/Rating.js \
      src/components/common/Pagination.js src/components/common/SaleBadge.js

# Components - home
touch src/components/home/HeroBanner.js src/components/home/CategoryCards.js \
      src/components/home/FeaturedProducts.js src/components/home/DealBanner.js \
      src/components/home/TrustBadges.js src/components/home/ProductTabs.js

# Components - product
touch src/components/product/ProductCard.js src/components/product/ProductGrid.js \
      src/components/product/ProductFilter.js src/components/product/SizeSelector.js \
      src/components/product/ColorSelector.js src/components/product/ImageGallery.js \
      src/components/product/ProductReviews.js

# Components - cart
touch src/components/cart/CartItem.js src/components/cart/CartSidebar.js \
      src/components/cart/CartSummary.js

# Components - checkout
touch src/components/checkout/ShippingForm.js src/components/checkout/PaymentForm.js \
      src/components/checkout/OrderSummary.js

# Components - admin
touch src/components/admin/AdminSidebar.js src/components/admin/StatsCard.js \
      src/components/admin/ProductForm.js src/components/admin/OrderTable.js \
      src/components/admin/ImageUpload.js

# Pages
touch src/pages/HomePage.js src/pages/ShopPage.js src/pages/ProductDetailPage.js \
      src/pages/CartPage.js src/pages/CheckoutPage.js src/pages/LoginPage.js \
      src/pages/RegisterPage.js src/pages/OrderConfirmationPage.js \
      src/pages/WomenPage.js src/pages/KidsPage.js src/pages/SearchPage.js \
      src/pages/NotFoundPage.js src/pages/ProfilePage.js

# Admin pages
touch src/pages/admin/AdminDashboard.js src/pages/admin/AdminProducts.js \
      src/pages/admin/AdminAddProduct.js src/pages/admin/AdminEditProduct.js \
      src/pages/admin/AdminOrders.js src/pages/admin/AdminOrderDetail.js \
      src/pages/admin/AdminLogin.js src/pages/admin/AdminCategories.js

touch src/.env

cd ..

echo "✅ Folder structure created! Now add .env files and paste code."
echo "📁 Structure ready in: $(pwd)/suitingstudio"
