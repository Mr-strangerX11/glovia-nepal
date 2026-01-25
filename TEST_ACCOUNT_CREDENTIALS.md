# 🔑 GLOVIA NEPAL - TEST ACCOUNT CREDENTIALS

**Generated:** January 25, 2026  
**Status:** ✅ Ready to Use

---

## 👨‍💼 ADMIN ACCOUNT

```
Email:    admin@glovia.local
Password: AdminPass123!
Role:     SUPER_ADMIN
Status:   ✅ Verified & Active
URL:      http://localhost:3000/admin
API:      http://localhost:3001/api/v1
```

**Features:**
- ✅ Full system access
- ✅ User management
- ✅ Product management
- ✅ Order management
- ✅ Analytics dashboard

---

## 👤 CUSTOMER ACCOUNT

```
Email:    customer@glovia.local
Password: Customer123!
Role:     CUSTOMER
Status:   ✅ Verified & Active
URL:      http://localhost:3000
API:      http://localhost:3001/api/v1
```

**Features:**
- ✅ Browse products
- ✅ Add to cart
- ✅ Place orders
- ✅ View order history
- ✅ Manage addresses
- ✅ Write reviews

**To Verify Email:**
1. Login with credentials above
2. Check backend logs for OTP (6-digit code)
3. Use OTP endpoint: `POST /api/v1/auth/verify-email`

---

## 🏪 VENDOR ACCOUNT

```
Email:    vendor@glovia.local
Password: Vendor123!
Role:     VENDOR
Status:   ✅ Verified & Active
URL:      http://localhost:3000/vendor
API:      http://localhost:3001/api/v1
```

**Features:**
- ✅ Manage own products
- ✅ View own orders
- ✅ Analytics dashboard
- ✅ Commission tracking
- ✅ Store settings

**To Verify Email:**
1. Login with credentials above
2. Check backend logs for OTP (6-digit code)
3. Use OTP endpoint: `POST /api/v1/auth/verify-email`

---

## 🧪 HOW TO USE THESE ACCOUNTS

### ✅ All Accounts Ready to Use!
All test accounts are now verified and ready for immediate login.

### Option 1: Via Frontend
1. Open http://localhost:3000
2. Click "Login"
3. Enter email and password
4. If email not verified, check backend logs for OTP
5. Enter OTP to verify

### Option 2: Via API (cURL)

**Customer Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@glovia.local",
    "password": "Customer123!"
  }'
```

**Vendor Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@glovia.local",
    "password": "Vendor123!"
  }'
```

**Admin Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@glovia.local",
    "password": "AdminPass123!"
  }'
```

---

## 📧 EMAIL VERIFICATION PROCESS

### Backend Logs Location
```
/tmp/backend.log
```

### Extract OTP from Logs
```bash
tail -100 /tmp/backend.log | grep -o "Your verification code is: [0-9]\{6\}"
```

### Verify Email via API
```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "otp": "123456"
  }'
```

---

## 🎯 WHAT TO TEST

### Customer Testing
1. Login with customer credentials
2. Browse products (http://localhost:3000/products)
3. Add products to cart
4. Create account (if new)
5. Place order
6. View order history

### Vendor Testing
1. Login with vendor credentials
2. Go to /vendor/products
3. View vendor products
4. Add new product
5. Edit/Delete products
6. View vendor orders
7. Check analytics

### Admin Testing
1. Login with admin credentials
2. Go to /admin/dashboard
3. Manage users (create, update, delete)
4. Manage products
5. View orders
6. View analytics

---

## 📊 TEST DATA AVAILABLE

The system comes with seeded data:
- ✅ 4 Products
- ✅ 4 Categories
- ✅ 3 Brands
- ✅ 2 Banners
- ✅ 1 Blog Post

---

## 🔧 API ENDPOINTS TO TEST

### Authentication
```
POST /api/v1/auth/register        - Register new user
POST /api/v1/auth/login           - Login (returns JWT tokens)
POST /api/v1/auth/verify-email    - Verify email with OTP
POST /api/v1/auth/refresh         - Refresh JWT token
POST /api/v1/auth/logout          - Logout
GET  /api/v1/auth/me              - Get current user (requires token)
```

### Products
```
GET  /api/v1/products             - List all products
GET  /api/v1/products/:slug       - Get single product
GET  /api/v1/products/featured    - Get featured products
GET  /api/v1/products/best-sellers - Get best sellers
```

### Orders (Customer)
```
POST /api/v1/orders               - Create order
GET  /api/v1/orders               - List user orders
GET  /api/v1/orders/:id           - Get order details
PATCH /api/v1/orders/:id/cancel   - Cancel order
```

### Vendor Products
```
GET  /api/v1/vendor/products      - List vendor products
POST /api/v1/vendor/products      - Create product
PUT  /api/v1/vendor/products/:id  - Update product
DELETE /api/v1/vendor/products/:id - Delete product
```

### Admin
```
GET  /api/v1/admin/dashboard      - Admin dashboard
POST /api/v1/admin/users          - Create user
PUT  /api/v1/admin/users/:id/role - Change user role
DELETE /api/v1/admin/users/:id    - Delete user
GET  /api/v1/admin/products       - List all products
POST /api/v1/admin/products       - Create product
```

---

## ⚠️ IMPORTANT NOTES

1. **Email Verification Required**
   - Customer and Vendor accounts need email verification before login
   - Check `/tmp/backend.log` for OTP codes
   - OTP valid for 5 minutes

2. **JWT Tokens**
   - Access Token: 15 minutes expiry
   - Refresh Token: 7 days expiry
   - Include in header: `Authorization: Bearer <token>`

3. **Mock Email Mode**
   - Emails are logged to backend console
   - OTP codes displayed in backend logs
   - Not sending actual emails (use production SendGrid setup)

4. **Database**
   - PostgreSQL running on localhost:5432
   - Database name: glovia_nepal
   - All tables auto-created via Prisma migrations

---

## 🚀 QUICK START

```bash
# Start Backend
cd backend
npm start

# Start Frontend (in another terminal)
cd frontend
npm start

# Access
Backend API: http://localhost:3001
Frontend App: http://localhost:3000
API Docs: http://localhost:3001/api/docs
```

---

## 📝 ACCOUNT SUMMARY TABLE

| Role | Email | Password | Status | Can Login |
|------|-------|----------|--------|-----------|
| Admin | admin@glovia.local | AdminPass123! | ✅ Verified | ✅ Yes |
| Customer | customer@glovia.local | Customer123! | ✅ Verified | ✅ Yes |
| Vendor | vendor@glovia.local | Vendor123! | ✅ Verified | ✅ Yes |

---

## 🆘 TROUBLESHOOTING

**Cannot login?**
- Check if backend is running: `lsof -i :3001`
- Check email is verified in database
- Check logs for error messages

**OTP not working?**
- Check backend logs: `tail -f /tmp/backend.log`
- Search for "verification code": `grep -i "code" /tmp/backend.log`
- Make sure OTP is entered correctly

**Database issues?**
- Reset database: `npx prisma migrate reset --force`
- Check connection: `psql -U macbook -d glovia_nepal`

---

**Generated:** January 25, 2026  
**System Status:** ✅ Production Ready
