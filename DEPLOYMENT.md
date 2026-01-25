# Glovia Nepal - Deployment Guide

This guide provides step-by-step instructions for deploying Glovia Nepal to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- Redis server
- Cloudinary account
- Payment gateway accounts (eSewa, Khalti, IME Pay)
- Domain name configured with Cloudflare

## Backend Deployment (Railway/AWS)

### 1. Database Setup

```bash
# Create production database
createdb glovia_nepal_prod

# Run migrations
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 2. Environment Variables

Set the following environment variables in your hosting platform:

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/glovia_nepal_prod
REDIS_URL=redis://host:6379
JWT_SECRET=<your-strong-secret>
JWT_REFRESH_SECRET=<your-strong-refresh-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
ESEWA_MERCHANT_ID=<production-merchant-id>
KHALTI_SECRET_KEY=<production-secret-key>
IME_MERCHANT_CODE=<production-merchant-code>
FRONTEND_URL=https://glovia.com.np
```

### 3. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy
cd backend
railway up
```

### 4. Deploy to AWS EC2 (Alternative)

```bash
# SSH to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql redis-server nginx

# Clone repository
git clone https://github.com/yourusername/glovia-nepal.git
cd glovia-nepal/backend

# Install dependencies
npm install

# Build
npm run build

# Setup PM2 for process management
npm install -g pm2
pm2 start dist/main.js --name glovia-api
pm2 save
pm2 startup

# Configure Nginx
sudo nano /etc/nginx/sites-available/glovia-api
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name api.glovia.com.np;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/glovia-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.glovia.com.np
```

## Frontend Deployment (Vercel)

### 1. Environment Variables

Create `.env.production` in frontend directory:

```bash
NEXT_PUBLIC_API_URL=https://api.glovia.com.np/api/v1
NEXT_PUBLIC_SITE_URL=https://glovia.com.np
NEXT_PUBLIC_SITE_NAME=Glovia Nepal
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=<production-public-key>
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

Or deploy via Vercel Dashboard:
1. Import GitHub repository
2. Select frontend directory as root
3. Add environment variables
4. Deploy

### 3. Custom Domain Setup

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your domain: glovia.com.np
3. Update DNS records as instructed

## Cloudflare Configuration

### DNS Records

```
Type    Name    Content                 Proxy
A       @       <vercel-ip>            ✓
CNAME   www     glovia.com.np          ✓
CNAME   api     <railway-domain>       ✓
```

### Security Settings

1. **SSL/TLS:** Full (strict)
2. **Always Use HTTPS:** On
3. **Automatic HTTPS Rewrites:** On
4. **Minimum TLS Version:** 1.2

### Performance

1. **Auto Minify:** CSS, JS, HTML
2. **Brotli:** On
3. **Caching Level:** Standard

### Firewall Rules

```
(http.request.uri.path contains "/api/admin" and not ip.src in {your.admin.ip})
Action: Block
```

## Database Backup

### Automated Backups

```bash
# Create backup script
nano /home/ubuntu/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump glovia_nepal_prod > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
chmod +x /home/ubuntu/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/ubuntu/backup.sh
```

## Monitoring

### Setup Application Monitoring

1. **Backend:** Use PM2 monitoring or Railway logs
2. **Frontend:** Vercel Analytics
3. **Database:** PostgreSQL monitoring tools
4. **Uptime:** UptimeRobot or Pingdom

### Health Checks

Create `/health` endpoint in backend:

```typescript
@Get('health')
async health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] DNS records propagated
- [ ] Payment gateways in production mode
- [ ] Email notifications working
- [ ] Backup system running
- [ ] Monitoring tools active
- [ ] Admin account created
- [ ] Test order placed and completed
- [ ] All legal pages accessible
- [ ] Mobile responsiveness verified
- [ ] Page load speed optimized
- [ ] SEO meta tags verified

## Rollback Procedure

### Backend

```bash
# Railway
railway rollback

# AWS
pm2 stop glovia-api
cd glovia-nepal/backend
git checkout <previous-commit>
npm install
npm run build
pm2 restart glovia-api
```

### Frontend

```bash
# Vercel
vercel rollback
```

## Support

For deployment issues:
- Email: tech@glovia.com.np
- Documentation: https://docs.glovia.com.np
