# SuitingStudio — Complete Setup Commands
# Run these in Git Bash from your project root

## ─────────────────────────────────────────────
## STEP 1: Create Root Project Folder
## ─────────────────────────────────────────────
mkdir suitingstudio && cd suitingstudio
git init
touch .gitignore
echo "node_modules/
.env
dist/
build/
uploads/" >> .gitignore

## ─────────────────────────────────────────────
## STEP 2: Create Backend Structure
## ─────────────────────────────────────────────
mkdir backend && cd backend
npm init -y

# Install backend dependencies
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer nodemailer stripe express-async-handler morgan helmet express-rate-limit

# Install dev dependencies
npm install --save-dev nodemon

# Create backend folder structure
mkdir -p config controllers middleware models routes uploads utils

# Create all backend files
touch server.js .env
touch config/db.js config/cloudinary.js
touch models/User.js models/Product.js models/Order.js models/Category.js
touch controllers/authController.js controllers/productController.js controllers/orderController.js controllers/adminController.js controllers/categoryController.js
touch routes/authRoutes.js routes/productRoutes.js routes/orderRoutes.js routes/adminRoutes.js routes/categoryRoutes.js routes/uploadRoutes.js
touch middleware/authMiddleware.js middleware/adminMiddleware.js middleware/errorMiddleware.js middleware/uploadMiddleware.js
touch utils/sendEmail.js utils/generateToken.js utils/seedData.js

cd ..

## ─────────────────────────────────────────────
## STEP 3: Create Frontend Structure
## ─────────────────────────────────────────────
npx create-react-app frontend --template cra-template
cd frontend

# Install frontend dependencies
npm install axios react-router-dom @stripe/stripe-js @stripe/react-stripe-js react-hot-toast react-icons framer-motion react-slick slick-carousel react-helmet-async react-loading-skeleton

# Create folder structure
mkdir -p src/pages/admin
mkdir -p src/components/admin
mkdir -p src/components/common
mkdir -p src/components/product
mkdir -p src/components/cart
mkdir -p src/components/layout
mkdir -p src/routes
mkdir -p src/hooks
mkdir -p src/context
mkdir -p src/services
mkdir -p src/assets/images

# Create page files
touch src/pages/HomePage.jsx
touch src/pages/ShopPage.jsx
touch src/pages/ProductDetailPage.jsx
touch src/pages/CartPage.jsx
touch src/pages/CheckoutPage.jsx
touch src/pages/LoginPage.jsx
touch src/pages/RegisterPage.jsx
touch src/pages/OrderSuccessPage.jsx
touch src/pages/NotFoundPage.jsx
touch src/pages/admin/AdminLoginPage.jsx
touch src/pages/admin/AdminDashboardPage.jsx
touch src/pages/admin/AdminProductsPage.jsx
touch src/pages/admin/AdminAddProductPage.jsx
touch src/pages/admin/AdminEditProductPage.jsx
touch src/pages/admin/AdminOrdersPage.jsx
touch src/pages/admin/AdminOrderDetailPage.jsx
touch src/pages/admin/AdminCategoriesPage.jsx

# Create component files
touch src/components/layout/Navbar.jsx
touch src/components/layout/Footer.jsx
touch src/components/layout/HeroBanner.jsx
touch src/components/layout/CategorySection.jsx
touch src/components/layout/TrustBadges.jsx
touch src/components/common/Loader.jsx
touch src/components/common/Message.jsx
touch src/components/common/SearchBar.jsx
touch src/components/common/Pagination.jsx
touch src/components/common/Rating.jsx
touch src/components/common/SaleBadge.jsx
touch src/components/product/ProductCard.jsx
touch src/components/product/ProductGrid.jsx
touch src/components/product/ProductFilter.jsx
touch src/components/product/ProductTabs.jsx
touch src/components/cart/CartItem.jsx
touch src/components/cart/CartSummary.jsx
touch src/components/admin/AdminSidebar.jsx
touch src/components/admin/DashboardStats.jsx
touch src/components/admin/OrderStatusBadge.jsx

# Create context, hooks, services, routes
touch src/context/AuthContext.jsx
touch src/context/CartContext.jsx
touch src/hooks/useProducts.js
touch src/hooks/useCart.js
touch src/hooks/useAuth.js
touch src/services/api.js
touch src/services/productService.js
touch src/services/orderService.js
touch src/services/authService.js
touch src/routes/PrivateRoute.jsx
touch src/routes/AdminRoute.jsx

cd ..

## ─────────────────────────────────────────────
## STEP 4: Root-level files
## ─────────────────────────────────────────────
touch README.md

echo "✅ All folders and files created!"
echo "Now copy-paste each code file from the provided source files."
