# Glovia Nepal - Development Guide

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis (optional for development)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd "glovia Nepal"
```

2. **Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will run on http://localhost:3001
API documentation available at http://localhost:3001/api/docs

3. **Frontend Setup**

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## Project Structure

```
glovia-nepal/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── users/      # User management
│   │   │   ├── products/   # Product catalog
│   │   │   ├── orders/     # Order processing
│   │   │   ├── payments/   # Payment gateways
│   │   │   └── admin/      # Admin operations
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Configuration
│   │   └── database/       # Database connection
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities & API client
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # State management
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── docs/                  # Documentation
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

## Development Workflow

### Database Changes

When making database schema changes:

```bash
cd backend

# 1. Update prisma/schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name <migration-name>

# 3. Generate Prisma client
npx prisma generate
```

### Running Tests

Backend:
```bash
cd backend
npm run test           # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

Frontend:
```bash
cd frontend
npm run test
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## API Documentation

### Authentication

```typescript
// Register
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9841234567"
}

// Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response includes access_token and refresh_token
```

### Products

```typescript
// Get all products
GET /api/v1/products?page=1&limit=20&category=skincare

// Get product by slug
GET /api/v1/products/:slug

// Get featured products
GET /api/v1/products/featured?limit=8
```

### Orders

```typescript
// Create order
POST /api/v1/orders
{
  "addressId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "paymentMethod": "CASH_ON_DELIVERY"
}
```

Full API documentation available at `/api/docs` when backend is running.

## Environment Variables

### Backend (.env)

```bash
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/glovia_nepal

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateways
ESEWA_MERCHANT_ID=your-merchant-id
KHALTI_SECRET_KEY=your-secret-key
IME_MERCHANT_CODE=your-merchant-code

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Glovia Nepal
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=your-public-key
```

## Database Schema

Key models:
- **User**: Customer and admin accounts
- **Product**: Product catalog with images
- **Category**: Product categorization
- **Order**: Customer orders
- **Payment**: Payment tracking
- **Cart**: Shopping cart items
- **Wishlist**: User wishlist
- **Review**: Product reviews
- **Address**: Delivery addresses

See `backend/prisma/schema.prisma` for full schema.

## Payment Gateway Integration

### eSewa
1. Register at https://esewa.com.np/
2. Get merchant credentials
3. Configure in backend `.env`

### Khalti
1. Register at https://khalti.com/
2. Get API keys
3. Configure in both backend and frontend

### IME Pay
1. Contact IME Pay for merchant account
2. Get credentials
3. Configure in backend `.env`

## Common Issues

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify DATABASE_URL in .env
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # or 3001

# Kill process
kill -9 <PID>
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

## Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Run linting and tests
5. Submit pull request

## Support

- Email: support@glovia.com.np
- Documentation: /docs
- Issues: GitHub Issues
