# Glovia Nepal - E-Commerce Platform

Production-ready e-commerce platform for cosmetic and beauty products in Nepal.

## 🏗️ Architecture Layers Overview

Four-layer stack to keep concerns clear:
- **Frontend (Client)**: React/Next.js web app with signup/login, Admin/Vendor/Customer dashboards, role-based rendering, API requests to backend.
- **Backend (Server)**: REST/GraphQL API with auth (JWT or session), role-based access, and business logic for products, orders, users.
- **Database**: Core tables for users, roles/permissions, products, orders, plus optional activity logs.
- **External Services**: Email (verification/reset), payment gateway, cloud storage for media, analytics/monitoring.

## 🔑 Core Account Components

| Component | Purpose |
| --- | --- |
| Authentication Service | Handles signup, login, JWT generation, password hashing |
| Authorization Middleware | Checks user role and gates dashboards/APIs |
| Dashboard Router | Redirects to Admin/Vendor/Customer dashboards |
| User Management API | CRUD for users, roles, permissions (Admin only) |
| Role-Based Access Control | Ensures endpoints/features are role-specific |
| Session / Token Store | Stores active JWT tokens or session data |

## 🔄 User Interaction Flow

1) User opens the site and chooses signup/login. 2) Frontend sends credentials to Auth API. 3) Backend validates and issues JWT. 4) Token stored in local/session storage. 5) Frontend includes token on each API call. 6) Backend verifies token and role. 7) Backend returns role-scoped data; frontend shows the correct dashboard.

## 📐 Diagram Layout (for draw.io)

```
[User Browser]
	|
	|  HTTP/HTTPS
	v
[Frontend Web App]
(Signup/Login, Dashboards)
	|
	|  API Calls (with JWT)
	v
[Backend Server / API]
 ├── Authentication Service
 ├── Authorization Middleware
 ├── User Management
 ├── Product & Order Management
	|
	v
[Database]
 ├── Users Table
 ├── Roles Table
 ├── Products Table
 └── Orders Table
	|
	v
[External Services]
 ├── Email Service (verification, reset)
 ├── Payment Gateway
 └── Cloud Storage

Arrows show data flow: user → frontend → backend → database/external services. Backend performs role checks before returning data, driving different dashboards (Admin, Vendor, Customer).
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Context + SWR
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Payment**: eSewa, Khalti, IME Pay

### Infrastructure
- **Hosting**: Vercel (Frontend) + AWS/Railway (Backend)
- **CDN**: Cloudflare
- **Database**: Supabase/AWS RDS
- **Cache**: Upstash Redis

## 📁 Project Structure

```
glovia-nepal/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   └── admin/
│   │   ├── common/
│   │   ├── config/
│   │   └── database/
│   └── prisma/
├── frontend/                # Next.js App
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── types/
│   └── public/
└── docs/                    # Documentation
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

## 🌍 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/glovia
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ESEWA_MERCHANT_ID=your-merchant-id
KHALTI_SECRET_KEY=your-secret-key
IME_MERCHANT_CODE=your-merchant-code
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

### Backend (Railway/AWS)
1. Configure production environment
2. Run migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm run start:prod`

## 📱 Features

- ✅ Mobile-first responsive design
- ✅ SEO optimized
- ✅ Multi-language support (English/Nepali)
- ✅ Cash on Delivery
- ✅ Multiple payment gateways
- ✅ Real-time order tracking
- ✅ Admin dashboard
- ✅ Inventory management
- ✅ Customer reviews & ratings
- ✅ Wishlist & cart
- ✅ Address book
- ✅ Email notifications
- ✅ Analytics dashboard

## 📄 License

Proprietary - Glovia Nepal © 2025

## 👥 Support

For support, email support@glovia.com.np
