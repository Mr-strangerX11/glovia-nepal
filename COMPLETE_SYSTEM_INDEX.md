# Glovia Nepal - Complete System Documentation

**Last Updated:** February 2, 2026  
**Status:** ✅ ALL SYSTEMS OPERATIONAL

---

## 🎯 Quick Navigation

### 📚 Documentation Files
1. **[OTP_MIGRATION_COMPLETE.md](./OTP_MIGRATION_COMPLETE.md)** - OTP system moved to backend ✅
2. **[OTP_INTEGRATION_GUIDE.md](./OTP_INTEGRATION_GUIDE.md)** - Complete integration instructions
3. **[TEST_RESULTS.md](./TEST_RESULTS.md)** - API testing and verification report
4. **[README.md](./README.md)** - Main project documentation
5. **[backend/python-services/README.md](./backend/python-services/README.md)** - Python services overview
6. **[backend/python-services/otp-auth/README.md](./backend/python-services/otp-auth/README.md)** - OTP system documentation (6.6 KB)

### 🚀 Getting Started

#### Quick Setup
```bash
# 1. Start backend API (NestJS)
cd backend
npm run start:prod

# 2. Start OTP service (in another terminal)
bash backend/start-otp.sh

# 3. Start frontend (in another terminal)
cd frontend
npm run dev
```

#### Services Running
```
NestJS API:        http://localhost:3001/api/v1
Frontend:          http://localhost:3000
OTP Service:       http://localhost:8000
OTP Docs:          http://localhost:8000/docs
```

---

## 📋 Project Structure

```
glovia-nepal/
│
├── 📄 Documentation Files
│   ├── README.md                          # Main project docs
│   ├── QUICKSTART.md                      # Quick start guide
│   ├── OTP_MIGRATION_COMPLETE.md         # OTP system migration ✅ NEW
│   ├── OTP_INTEGRATION_GUIDE.md          # OTP integration ✅ NEW
│   ├── TEST_RESULTS.md                   # Test results ✅ NEW
│   └── ... (other docs)
│
├── 🔵 backend/                            # NestJS Backend
│   ├── src/                              # TypeScript source
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── modules/
│   │       ├── brands/                   # ✨ Brand Management (NEW)
│   │       ├── auth/
│   │       ├── products/
│   │       ├── categories/
│   │       ├── orders/
│   │       ├── cart/
│   │       ├── users/
│   │       └── ... (other modules)
│   │
│   ├── 🐍 python-services/               # ✨ Python Microservices (NEW)
│   │   ├── README.md                    # Service overview
│   │   └── otp-auth/                    # ✅ OTP Auth System (MIGRATED)
│   │       ├── main.py                  # FastAPI app
│   │       ├── config.py               # Settings
│   │       ├── models.py               # Data models
│   │       ├── database.py             # MongoDB connection
│   │       ├── auth.py                 # JWT handling
│   │       ├── utils.py                # OTP, email, hashing
│   │       ├── requirements.txt        # Dependencies
│   │       ├── .env                   # Configuration
│   │       ├── .env.example           # Template
│   │       ├── README.md              # Full documentation
│   │       ├── setup.sh               # Setup script
│   │       └── venv/                  # Python virtual environment
│   │
│   ├── prisma/                          # Database schema
│   ├── package.json                     # Node dependencies
│   ├── start-all.sh                     # ✨ Start both services (NEW)
│   ├── start-otp.sh                     # ✨ Start OTP only (NEW)
│   └── ... (NestJS config files)
│
├── 🎨 frontend/                           # Next.js Frontend
│   ├── src/
│   │   ├── app/                        # App routes
│   │   ├── components/                 # React components
│   │   └── ... (frontend code)
│   ├── package.json                    # NPM dependencies
│   └── ... (Next.js config)
│
└── 📦 docker-compose.yml               # Docker orchestration

```

---

## ✨ Recent Updates

### 🎉 NEW: Brand Management System
**Location:** `backend/src/modules/brands/`
- ✅ Complete CRUD operations
- ✅ Brand analytics dashboard
- ✅ Public brand listing page
- ✅ Admin management interface
- ✅ Product filtering by brand

**Test:** `curl http://localhost:3001/api/v1/brands`

### 🎉 NEW: OTP Authentication System (Migrated)
**Location:** `backend/python-services/otp-auth/`
- ✅ Moved from `/otp-auth-system/` to backend
- ✅ Complete FastAPI implementation
- ✅ MongoDB integration
- ✅ JWT token generation
- ✅ Email OTP with templates
- ✅ Rate limiting & attempt limiting
- ✅ Comprehensive documentation

**Test:** Visit `http://localhost:8000/docs` (when running)

### ✅ Fixed: All Compilation Errors
- ✅ Backend TypeScript errors (4 fixed)
- ✅ Frontend type mismatches (2 fixed)
- ✅ Python dependencies (resolved Python 3.14 issues)

---

## 🚀 Starting the System

### Option 1: Individual Services (Recommended for Development)

```bash
# Terminal 1: Backend NestJS
cd backend
npm run start:prod
# Running on: http://localhost:3001

# Terminal 2: OTP Service
cd backend
bash start-otp.sh
# Running on: http://localhost:8000

# Terminal 3: Frontend
cd frontend
npm run dev
# Running on: http://localhost:3000
```

### Option 2: Automated Scripts

```bash
# Start both backend and OTP
cd backend
bash start-all.sh

# Or just OTP
bash start-otp.sh
```

### Prerequisites

- ✅ Node.js 18+ installed
- ✅ Python 3.8+ installed
- ✅ PostgreSQL running (for NestJS)
- ✅ MongoDB running (for OTP service)
- ✅ Port 3000, 3001, 8000 available

---

## 🧪 API Testing

### Backend API (NestJS on port 3001)

```bash
# Get brands
curl http://localhost:3001/api/v1/brands

# Get products
curl http://localhost:3001/api/v1/products?limit=5

# Get categories
curl http://localhost:3001/api/v1/categories

# API Documentation
# Visit: http://localhost:3001/api/docs
```

### OTP Service (FastAPI on port 8000)

```bash
# Send OTP
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# API Documentation
# Visit: http://localhost:8000/docs
```

---

## 📊 System Features

### Backend (NestJS + PostgreSQL)
- ✅ User authentication & JWT
- ✅ Product catalog with filtering
- ✅ Shopping cart management
- ✅ Order processing
- ✅ Brand management ✨ NEW
- ✅ Product reviews
- ✅ Admin dashboard
- ✅ Vendor portal
- ✅ Payment processing (eSewa, Khalti, IMEPay)
- ✅ Role-based access control

### Frontend (Next.js + Tailwind)
- ✅ Responsive product pages
- ✅ Brand listing & detail pages ✨ NEW
- ✅ Shopping cart interface
- ✅ Order tracking
- ✅ User dashboard
- ✅ Admin panel
- ✅ Search & filtering
- ✅ Category browsing

### OTP Service (FastAPI + MongoDB) ✨ NEW
- ✅ Email-based authentication
- ✅ 6-digit OTP generation
- ✅ JWT token creation
- ✅ Rate limiting
- ✅ Attempt limiting
- ✅ HTML email templates
- ✅ MongoDB user tracking
- ✅ Swagger API docs

---

## 🔐 Security

### Implemented Features
- ✅ JWT authentication (30-min tokens)
- ✅ Password hashing (bcrypt)
- ✅ OTP hashing (bcrypt)
- ✅ Rate limiting (5 req/min)
- ✅ CORS validation
- ✅ Email validation
- ✅ Attempt limiting
- ✅ HTTPS ready

### Recommended for Production
- [ ] Enable HTTPS/TLS
- [ ] Change JWT secret keys
- [ ] Configure real SMTP credentials
- [ ] Set up MongoDB authentication
- [ ] Enable backup & recovery
- [ ] Setup monitoring & logging
- [ ] Configure firewall rules

---

## 📚 Key Documentation

### For Backend Developers
1. **Backend Setup:** `backend/README.md` (if exists)
2. **OTP Service:** `backend/python-services/otp-auth/README.md` (6.6 KB)
3. **Python Services:** `backend/python-services/README.md`
4. **Integration Guide:** `OTP_INTEGRATION_GUIDE.md`

### For Frontend Developers
1. **Frontend Setup:** `frontend/README.md` (if exists)
2. **API Endpoints:** `OTP_INTEGRATION_GUIDE.md` (Frontend Integration section)
3. **Components:** Check `frontend/src/components/`

### For DevOps/Deployment
1. **Deployment:** `DEPLOYMENT.md`
2. **Docker:** `docker-compose.yml`
3. **Environment:** See `.env` files

---

## 🐛 Troubleshooting

### Backend Issues

**Port 3001 already in use:**
```bash
lsof -i :3001
kill -9 <PID>
```

**PostgreSQL connection error:**
```bash
# Check PostgreSQL is running
pg_isready
# Start PostgreSQL
brew services start postgresql
```

**TypeScript compilation error:**
```bash
npm run build
```

### OTP Service Issues

**Port 8000 already in use:**
```bash
lsof -i :8000
kill -9 <PID>
```

**MongoDB connection error:**
```bash
mongosh  # Test connection
# Start MongoDB
brew services start mongodb-community
```

**Dependencies not installing:**
```bash
cd backend/python-services/otp-auth
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend Issues

**Node modules error:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

---

## 📞 Support & Resources

### Documentation Files
- **Full OTP Guide:** `backend/python-services/otp-auth/README.md`
- **Integration Examples:** `OTP_INTEGRATION_GUIDE.md`
- **Migration Details:** `OTP_MIGRATION_COMPLETE.md`
- **Test Results:** `TEST_RESULTS.md`

### External Resources
- **FastAPI:** https://fastapi.tiangolo.com/
- **NestJS:** https://docs.nestjs.com/
- **Next.js:** https://nextjs.org/docs
- **MongoDB:** https://docs.mongodb.com/

### API Documentation
- **Backend Swagger:** http://localhost:3001/api/docs
- **OTP Swagger:** http://localhost:8000/docs

---

## 📈 Project Progress

| Feature | Status | Location |
|---------|--------|----------|
| NestJS Backend | ✅ Ready | `backend/src/` |
| PostgreSQL DB | ✅ Ready | Connection configured |
| Product Catalog | ✅ Ready | `backend/src/modules/products/` |
| Brand System | ✅ NEW | `backend/src/modules/brands/` |
| User Auth | ✅ Ready | `backend/src/modules/auth/` |
| Shopping Cart | ✅ Ready | `backend/src/modules/cart/` |
| Orders | ✅ Ready | `backend/src/modules/orders/` |
| OTP Service | ✅ NEW | `backend/python-services/otp-auth/` |
| Next.js Frontend | ✅ Ready | `frontend/src/` |
| Brand UI | ✅ NEW | `frontend/src/app/brands/` |
| Admin Panel | ✅ Ready | `frontend/src/app/admin/` |
| Docker Setup | ✅ Ready | `docker-compose.yml` |

---

## 🎯 Next Steps

1. ✅ Review documentation above
2. ✅ Start services using provided commands
3. ✅ Test API endpoints in browser
4. ✅ Integrate OTP with frontend
5. ⏳ Configure production environment
6. ⏳ Deploy to staging
7. ⏳ Final testing before production

---

## 📝 Version Info

**Created:** February 2, 2026  
**Glovia Nepal Version:** 1.0.0  
**Backend (NestJS):** 10.x  
**Frontend (Next.js):** 14.2.x  
**OTP Service:** 1.0.0  
**Database:** PostgreSQL + MongoDB  

---

## ✅ System Status

```
┌─────────────────────────────────────┐
│   ✅ GLOVIA NEPAL - ALL READY       │
├─────────────────────────────────────┤
│ ✅ Backend API       → 3001         │
│ ✅ Frontend          → 3000         │
│ ✅ OTP Service       → 8000         │
│ ✅ PostgreSQL        → 5432         │
│ ✅ MongoDB           → 27017        │
│                                     │
│ ✅ Brand System      (NEW)          │
│ ✅ OTP Integration   (NEW)          │
│ ✅ All Tests         (PASSED)       │
│ ✅ Documentation     (COMPLETE)     │
└─────────────────────────────────────┘
```

---

**Ready to develop and deploy! 🚀**

For detailed information on any component, refer to the specific documentation files listed above.
