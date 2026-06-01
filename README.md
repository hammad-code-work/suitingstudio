# 🧵 SuitingStudio — MERN Stack Garments E-Commerce

A full-featured, production-ready garments export e-commerce application for **Women** and **Kids** collections.

---

## 🏗️ Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | React.js, React Router, Axios, Stripe  |
| Backend    | Node.js, Express.js                    |
| Database   | MongoDB Atlas + Mongoose               |
| Auth       | JWT (JSON Web Tokens)                  |
| Payments   | Stripe                                 |
| Email      | Nodemailer (Gmail SMTP)                |
| Images     | Multer (local) / Cloudinary (optional) |
| Deploy     | Vercel (frontend) + Render (backend)   |

---

## 📁 Project Structure

```
suitingstudio/
├── frontend/                   # React.js app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/          # Admin sidebar, stats
│   │   │   ├── cart/           # Cart item, summary
│   │   │   ├── common/         # Loader, Rating, SearchBar, Pagination
│   │   │   ├── layout/         # Navbar, Footer, HeroBanner, CategorySection, TrustBadges
│   │   │   └── product/        # ProductCard, ProductFilter
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/          # All admin pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx (Stripe)
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── OrderSuccessPage.jsx
│   │   ├── routes/             # PrivateRoute, AdminRoute
│   │   └── services/           # api.js, productService, orderService, authService
│   └── package.json
│
└── backend/                    # Express.js API
    ├── config/                 # db.js
    ├── controllers/            # auth, product, order, admin, category
    ├── middleware/             # auth, admin, error, upload
    ├── models/                 # User, Product, Order, Category
    ├── routes/                 # All API routes
    ├── uploads/                # Local image storage
    ├── utils/                  # generateToken, sendEmail, seedData
    └── server.js
```

---

## ⚡ STEP 1: Git Bash Setup Commands

Run these in **Git Bash** from your desired folder:

```bash
# 1. Clone or create project
mkdir suitingstudio && cd suitingstudio
git init

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Stripe keys, etc.

# 3. Setup frontend
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your Stripe public key and API URL

# 4. Back to root
cd ..
```

---

## 🌿 STEP 2: MongoDB Atlas Setup

1. Go to **https://cloud.mongodb.com**
2. Create a free cluster (M0)
3. Create database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all, for dev)
5. Click **Connect → Connect your application**
6. Copy the connection string into `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/suitingstudio?retryWrites=true&w=majority
```

---

## 🌱 STEP 3: Seed Database

```bash
cd backend
node utils/seedData.js
```

This creates:
- ✅ Admin user: `admin@suitingstudio.com` / `Admin@12345`
- ✅ Women & Kids categories
- ✅ 6 sample products

---

## 🚀 STEP 4: Run Locally

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

---

## 🔑 Admin Panel Access

| URL | `http://localhost:3000/admin/login` |
|---|---|
| Email | `admin@suitingstudio.com` |
| Password | `Admin@12345` |

**Admin Features:**
- 📊 Dashboard with stats & revenue
- 📦 Add / Edit / Delete products
- 🖼️ Multi-image upload
- 🛍️ View & manage all orders
- ✅ Accept / Reject / Ship / Deliver orders
- 🗂️ Manage categories
- 📧 Auto email notifications

---

## 💳 Stripe Payment Setup

1. Create account at **https://stripe.com**
2. Get your keys from Dashboard → Developers → API Keys

**Backend `.env`:**
```env
STRIPE_SECRET_KEY=sk_test_...
```

**Frontend `.env`:**
```env
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

> For testing, use card: `4242 4242 4242 4242`, any future date, any CVC.

---

## 📧 Email Setup (Gmail)

1. Enable **2-Factor Authentication** on your Gmail
2. Go to Google Account → Security → **App Passwords**
3. Generate an app password for "Mail"

**Backend `.env`:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password_here
ADMIN_EMAIL=admin@suitingstudio.com
```

---

## 🌍 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Install Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

**Vercel Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
```

---

### Backend → Render.com

1. Push code to GitHub
2. Go to **https://render.com** → New Web Service
3. Connect GitHub repo → select `backend/` folder
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env`

---

### MongoDB → Atlas (Production)

- Whitelist Render's IP (or allow `0.0.0.0/0`)
- Use your production connection string

---

## 🛍️ Product Categories & Sizes

| Category | Sizes |
|----------|-------|
| **Women** | XS, S, M, L, XL, XXL |
| **Kids** | 1-2 Years, 3-4 Years, 5-6 Years, 7-8 Years, 9-10 Years, 11-12 Years |

---

## 📡 API Endpoints Reference

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile |
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/myorders` | My orders |
| GET | `/api/admin/stats` | Dashboard stats (admin) |
| GET | `/api/admin/orders` | All orders (admin) |
| PUT | `/api/admin/orders/:id/status` | Update order status (admin) |
| GET | `/api/categories` | Get categories |

---

## 💬 WhatsApp Notification (Optional)

For WhatsApp notifications using Twilio, install:
```bash
cd backend
npm install twilio
```

Then add to `utils/sendEmail.js` or create `utils/sendWhatsApp.js`:
```javascript
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = async (to, message) => {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body: message,
  });
};
```

Call it in `orderController.js` after order creation.

---

## 🔒 Security Checklist (Production)

- [ ] Change JWT_SECRET to a long random string
- [ ] Change admin password from default
- [ ] Use HTTPS for both frontend & backend
- [ ] Set `NODE_ENV=production`
- [ ] Restrict MongoDB Atlas IP to Render's IP
- [ ] Use Cloudinary instead of local file upload
- [ ] Enable rate limiting (already in server.js via `express-rate-limit`)
- [ ] Enable CORS for your production domain only

---

## 📞 Support

Built by SuitingStudio Dev Team.  
For issues, open a GitHub issue or contact: info@suitingstudio.com

---

**© 2024 SuitingStudio — All Rights Reserved**
