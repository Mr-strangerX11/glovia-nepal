# Quick Start Guide - Glovia Nepal

This guide will help you get the Glovia Nepal e-commerce platform running locally in minutes.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for caching)

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb glovia_nepal

# Or using psql
psql -U postgres -c "CREATE DATABASE glovia_nepal;"
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update these required values:
DATABASE_URL="postgresql://postgres:password@localhost:5432/glovia_nepal?schema=public"
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
```

**Frontend** (`frontend/.env.local`):
```bash
# Create frontend env file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
```

### 4. Initialize Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed initial data (optional)
npx prisma db seed
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/api

## Default Admin Credentials

After seeding the database:
- Email: `admin@glovia.com.np`
- Password: `admin123`

**⚠️ Change these credentials immediately in production!**

## Next Steps

### Payment Gateway Setup (for testing orders)

1. **eSewa Sandbox:**
   - Sign up at https://uat.esewa.com.np/epay/developer
   - Get merchant code and add to `.env`

2. **Khalti Test:**
   - Sign up at https://khalti.com
   - Get test keys from dashboard

3. **For development, use "Cash on Delivery" option**

### Cloudinary Setup (for image uploads)

1. Sign up at https://cloudinary.com
2. Get cloud name, API key, and secret from dashboard
3. Add to `backend/.env`

### Email Setup (optional)

For Gmail:
1. Enable 2-factor authentication
2. Generate app password
3. Add credentials to `backend/.env`

## Testing the Platform

### Test Customer Flow:
1. Visit http://localhost:3000
2. Browse products
3. Add items to cart
4. Proceed to checkout
5. Create account or login
6. Complete order with Cash on Delivery

### Test Admin Features:
1. Login at http://localhost:3000/admin
2. Add/edit products
3. Manage orders
4. View dashboard analytics

## Common Issues

### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql  # macOS
sudo systemctl restart postgresql  # Linux
```

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

## Development Tips

- **Hot Reload:** Both servers support hot reload
- **API Testing:** Use http://localhost:3001/api (Swagger UI)
- **Database GUI:** Use Prisma Studio
  ```bash
  cd backend
  npx prisma studio
  ```
- **Logs:** Check terminal output for errors

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

## Need Help?

- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed documentation
- Review backend logs for API errors
- Check browser console for frontend errors
- Verify environment variables are set correctly

## Project Structure

```
glovia-nepal/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
├── docker-compose.yml # Docker setup
└── docs/             # Documentation
```

Happy coding! 🚀
