# 🚀 Glovia Nepal - Vercel Deployment Guide

## ✅ Project is Ready for Deployment!

Your Glovia Nepal e-commerce platform is now configured and ready to be deployed on Vercel.

### 📋 Current Status

- **Repository:** https://github.com/Mr-strangerX11/glovia-nepal
- **Project Status:** ✅ Production Ready
- **Next.js Version:** 16.1.6 (Latest secure version)
- **Backend:** NestJS (Requires separate hosting)
- **Frontend:** Next.js (Ready for Vercel)

---

## 🔧 Deployment Configuration

### Vercel Project Settings

Your Vercel project is already linked. To configure it properly:

1. **Go to:** https://vercel.com/dashboard
2. **Select Project:** `glovia-nepal`
3. **Settings → Root Directory:** Set to `frontend`
4. **Settings → Build & Output Settings:**
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`

### Environment Variables to Set in Vercel Dashboard

Add these environment variables in **Settings → Environment Variables:**

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Glovia Nepal
NEXT_PUBLIC_SITE_DESCRIPTION=Premium Korean Beauty & Skincare Products in Nepal
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=your-khalti-key
NEXT_PUBLIC_ESEWA_MERCHANT_CODE=your-esewa-code
```

---

## 📦 Backend Deployment

The backend (NestJS) requires separate hosting. Options:

### Option 1: Railway (Recommended)
```bash
npm install -g railway
railway link
railway up
```

### Option 2: Render
1. Go to https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Select `backend` folder as root directory
5. Set environment variables
6. Deploy

### Option 3: AWS/DigitalOcean/Heroku
Use Docker to deploy the backend using `backend/Dockerfile`

---

## 🌐 Domain Configuration

After deployment, you can add a custom domain:

1. In Vercel Dashboard
2. Go to **Settings → Domains**
3. Add your domain (e.g., `glovia-nepal.com`)
4. Update DNS records as shown

---

## 📝 Required .env Variables

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
NEXT_PUBLIC_SITE_URL=https://www.your-domain.com
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/glovia_nepal
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-key
```

---

## ✅ Deployment Checklist

- [ ] Set up backend hosting (Railway/Render/AWS)
- [ ] Configure backend database (PostgreSQL)
- [ ] Set environment variables in Vercel
- [ ] Configure custom domain
- [ ] Set up email provider (SendGrid)
- [ ] Configure payment gateways (Khalti, eSewa, IMEPay)
- [ ] Test login and checkout flows
- [ ] Set up SSL/HTTPS (automatic with Vercel)

---

## 🚀 Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)
Every push to `main` branch automatically deploys to Vercel

### Option 2: Manual Deployment
```bash
vercel --prod
```

### Option 3: Vercel CLI with GitHub
```bash
vercel link
vercel --prod
```

---

## 📊 Monitoring & Analytics

After deployment, monitor your application:

1. **Vercel Analytics:** https://vercel.com/dashboard/analytics
2. **Error Tracking:** Built-in Error Tracking
3. **Performance:** Edge Function Analytics
4. **Logs:** Real-time deployment logs

---

## 🔒 Security Checklist

- [ ] Sensitive variables in Vercel (not in code)
- [ ] JWT secrets are strong and unique
- [ ] Database URL uses secure connection
- [ ] CORS properly configured for your domain
- [ ] API rate limiting enabled
- [ ] Email verification required
- [ ] Payment gateway credentials secure

---

## 📞 Support & Troubleshooting

### Common Issues

**Build fails with "Next.js not found"**
- Make sure root directory is set to `frontend` in Vercel settings

**Environment variables not loading**
- Check that variables are added to Vercel dashboard
- Rebuild after adding new variables

**API connection errors**
- Update `NEXT_PUBLIC_API_URL` to your backend URL
- Ensure CORS is enabled on backend

**Database errors**
- Verify `DATABASE_URL` is correct
- Run migrations on backend

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **NestJS Docs:** https://docs.nestjs.com
- **Project README:** See `README.md` in root

---

**Deployment Status:** ✅ Ready for Production
**Last Updated:** January 28, 2026
