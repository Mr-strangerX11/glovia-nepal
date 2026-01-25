# ⚡ Quick Start & Troubleshooting Guide

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

### 2. Start Frontend
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### 3. Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api/v1
- **API Docs:** http://localhost:3001/api/docs
- **Database:** localhost:5432

---

## 👤 Test Accounts

### Admin Account
```
Email: admin@glovia.local
Password: AdminPass123!
Role: SUPER_ADMIN
```

### Test User (Register via UI)
```
Use any email format: test@example.com
OTP will display in backend logs
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Port Already in Use (3001)
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>

# Or change port in .env
PORT=3002
```

### Issue 2: Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U macbook -d glovia_nepal

# Reset database and seed
cd backend
npx prisma migrate reset --force
```

### Issue 3: Email Not Sending
```bash
# Check backend logs for mock email
tail -f /tmp/backend.log | grep "EMAIL\|MOCK"

# In .env, ensure:
EMAIL_PROVIDER=mock  # for dev
# or for production:
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_key
```

### Issue 4: VS Code TypeScript Errors
```
This is a known non-issue (stale cache)
Fix: Cmd+Shift+P → "TypeScript: Restart TS Server"
Or: Restart VS Code
```

### Issue 5: Frontend Build Errors
```bash
# Clear cache and reinstall
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

---

## 📋 API Testing Examples

### 1. Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "phone": "9800000000"
  }'
```

### 2. Login (Get Tokens)
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@glovia.local",
    "password": "AdminPass123!"
  }'
```

### 3. Get Products
```bash
curl http://localhost:3001/api/v1/products
```

### 4. Get Protected Route (with Token)
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3001/api/v1/auth/me
```

### 5. Verify Email (Using OTP from logs)
```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id-from-register",
    "otp": "123456"
  }'
```

---

## 📊 System Status Check

### Check All Services Running
```bash
# Backend
lsof -i :3001 | grep -v COMMAND && echo "✅ Backend: Running" || echo "❌ Backend: Not running"

# Frontend
lsof -i :3000 | grep -v COMMAND && echo "✅ Frontend: Running" || echo "❌ Frontend: Not running"

# Database
lsof -i :5432 | grep -v COMMAND && echo "✅ Database: Running" || echo "❌ Database: Not running"
```

### Test Backend Health
```bash
curl http://localhost:3001/api/v1/categories | head -20
```

### Check Database Connection
```bash
cd backend
npx prisma studio
```

---

## 🔑 Important Files

### Configuration Files
- `backend/.env` - Backend settings
- `frontend/.env.local` - Frontend settings
- `backend/prisma/schema.prisma` - Database schema

### Key Backend Files
- `backend/src/modules/auth/` - Authentication
- `backend/src/modules/verification/` - Email/OTP service
- `backend/prisma/seed.ts` - Database seed

### Key Frontend Files
- `frontend/src/app/auth/` - Auth pages
- `frontend/src/components/` - Reusable components
- `frontend/src/lib/api.ts` - API client

---

## 🛠️ Useful Commands

### Backend Commands
```bash
# Build
npm run build

# Start development
npm start

# Create admin user
npm run create:admin

# Database studio
npx prisma studio

# Reset database
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate
```

### Frontend Commands
```bash
# Build
npm run build

# Start development
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 📱 Testing Vendor Features

### 1. Login as Admin
```bash
# Use admin credentials provided
```

### 2. Create Vendor User (Admin Only)
```bash
# Via API endpoint: POST /api/v1/admin/users
# Set role to "VENDOR"
```

### 3. Vendor Product CRUD
```bash
# List: GET /api/v1/vendor/products
# Create: POST /api/v1/vendor/products
# Edit: PUT /api/v1/vendor/products/:id
# Delete: DELETE /api/v1/vendor/products/:id
```

### 4. Access Vendor Dashboard
```
Frontend: /vendor/products
```

---

## 📈 Monitoring & Logs

### Backend Logs
```bash
# View in real-time
tail -f /tmp/backend.log

# Search for errors
grep "ERROR" /tmp/backend.log

# Search for email logs
grep "EMAIL\|MOCK" /tmp/backend.log
```

### Database Logs
```bash
# Connect to database
psql -U macbook -d glovia_nepal

# List tables
\dt

# Count users
SELECT COUNT(*) FROM "User";
```

---

## 🚀 Deployment Checklist

- [ ] Update .env with production database URL
- [ ] Change EMAIL_PROVIDER to "sendgrid" with valid keys
- [ ] Set NODE_ENV=production
- [ ] Update JWT_SECRET with strong random string
- [ ] Configure payment gateway credentials
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for production domain
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Build frontend: `npm run build`
- [ ] Test all endpoints in production
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

---

## 📞 Support Contact

For issues or questions:
1. Check logs: `tail -f /tmp/backend.log`
2. Review .env configuration
3. Verify database connection
4. Check API documentation: `http://localhost:3001/api/docs`

---

**Status: ✅ All Systems Operational**  
**Last Updated: January 25, 2026**
