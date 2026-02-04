# Glovia Nepal - OTP System Integration Guide

## 📋 Overview

The OTP (One-Time Password) authentication system has been moved into the backend as a Python microservice at:
```
backend/python-services/otp-auth/
```

This system provides secure email-based authentication that can be used alongside or integrated with the main NestJS backend.

---

## 🎯 Architecture

### Current Setup

```
Glovia Nepal/
├── backend/                          # Main NestJS Backend
│   ├── src/                         # TypeScript source
│   ├── python-services/             # Python Microservices (NEW)
│   │   └── otp-auth/               # OTP Authentication Service
│   │       ├── main.py             # FastAPI Application
│   │       ├── config.py           # Configuration
│   │       ├── models.py           # Data Models
│   │       ├── database.py         # MongoDB Connection
│   │       ├── auth.py             # JWT Handling
│   │       ├── utils.py            # Utilities (OTP, Email)
│   │       ├── requirements.txt    # Python Dependencies
│   │       ├── .env               # Configuration (create from .env.example)
│   │       ├── .env.example       # Configuration Template
│   │       ├── README.md          # Full Documentation
│   │       ├── venv/              # Virtual Environment
│   │       └── setup.sh           # Setup Script
│   ├── start-all.sh              # Start both services
│   ├── start-otp.sh              # Start just OTP service
│   └── ... (other NestJS files)
│
├── frontend/                       # Next.js Frontend
└── otp-auth-system/               # (DEPRECATED - moved to backend)
```

---

## 🚀 Quick Start

### 1. Setup OTP System

```bash
# Navigate to backend
cd backend

# Run automatic setup
cd python-services/otp-auth
bash setup.sh

# Or manual setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Configure .env

Edit `backend/python-services/otp-auth/.env`:

```env
# MongoDB (change to your instance)
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=otp_auth

# JWT (change secret in production!)
JWT_SECRET_KEY=your-super-secret-key-change-this

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password

# OTP Settings
OTP_LENGTH=6
OTP_EXPIRY_MINUTES=5
OTP_RESEND_COOLDOWN_SECONDS=60

# Frontend for CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Service

```bash
# Option A: From backend root
cd backend
bash start-otp.sh

# Option B: Direct
cd backend/python-services/otp-auth
source venv/bin/activate
python main.py
```

**Server will run on:** `http://localhost:8000`

### 4. Test the API

```bash
# 1. Send OTP
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Verify OTP (use code from email)
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# 3. Access protected endpoint
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Swagger/OpenAPI Docs
```
http://localhost:8000/docs
```

### Endpoints

#### 1. Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP sent successfully to your email",
  "email": "user@example.com",
  "expires_in_seconds": 300,
  "resend_available_in": 60
}
```

**Features:**
- Rate limited: 5 requests/minute
- Resend cooldown: 60 seconds
- OTP expires in: 5 minutes

#### 2. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "verified": true,
    "created_at": "2026-02-02T10:30:00Z"
  }
}
```

**Security:**
- Max 5 failed attempts
- Rate limited: 5 requests/minute
- OTP expires after 5 minutes

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "verified": true,
  "created_at": "2026-02-02T10:30:00Z"
}
```

#### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully",
  "email": "user@example.com"
}
```

---

## 💻 Frontend Integration

### React Example

```jsx
import React, { useState } from 'react';

const OTPLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [token, setToken] = useState(null);

  const sendOTP = async () => {
    const response = await fetch('http://localhost:8000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`OTP expires in ${data.expires_in_seconds}s`);
      setStep('otp');
    }
  };

  const verifyOTP = async () => {
    const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    
    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      console.log('Logged in:', data.user);
    }
  };

  if (token) {
    return <div>✅ Logged in! Token: {token.slice(0, 20)}...</div>;
  }

  return (
    <div>
      {step === 'email' ? (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button onClick={sendOTP}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default OTPLogin;
```

### Vue 3 Example

```vue
<template>
  <div class="otp-login">
    <div v-if="!token" class="form">
      <template v-if="step === 'email'">
        <input v-model="email" type="email" placeholder="Email" />
        <button @click="sendOTP">Send OTP</button>
      </template>
      <template v-else>
        <input v-model="otp" type="text" placeholder="6-digit OTP" maxlength="6" />
        <button @click="verifyOTP">Verify OTP</button>
      </template>
    </div>
    <div v-else class="success">
      ✅ Logged in! Token: {{ token.slice(0, 20) }}...
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const otp = ref('');
const step = ref('email');
const token = ref(null);

const sendOTP = async () => {
  const res = await fetch('http://localhost:8000/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value })
  });
  if (res.ok) {
    step.value = 'otp';
  }
};

const verifyOTP = async () => {
  const res = await fetch('http://localhost:8000/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, otp: otp.value })
  });
  if (res.ok) {
    const data = await res.json();
    token.value = data.access_token;
    localStorage.setItem('token', data.access_token);
  }
};
</script>
```

---

## 🔧 Environment Setup

### Gmail Configuration

1. Enable 2-Factor Authentication
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Use 16-character password in `SMTP_PASSWORD`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

### MongoDB Setup

**Local:**
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh
```

**Atlas (Cloud):**
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/otp_auth?retryWrites=true&w=majority
DATABASE_NAME=otp_auth
```

---

## 🚨 Troubleshooting

### Port 8000 Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
mongod --version
brew services start mongodb-community
```

### Email Not Sending
```
Error: Failed to send OTP email
```
**Solutions:**
- Verify SMTP credentials in .env
- For Gmail: Use App Password (16 chars)
- Check firewall allows SMTP port 587
- Enable "Less secure apps" if using Gmail password

### Invalid Token
```
Error: Invalid or expired token
```
**Solutions:**
- Token expires after 30 minutes (configurable)
- Request new OTP and verify again
- Check JWT_SECRET_KEY hasn't changed

---

## 📊 Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "verified": true,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### OTPs Collection
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "otp_hash": "$2b$12$...",
  "created_at": ISODate,
  "expires_at": ISODate,
  "attempts": 0,
  "last_resend_at": ISODate
}
```

---

## 🔐 Security Features

✅ **OTP Hashing** - bcrypt hashing, never store plain OTP  
✅ **Rate Limiting** - 5 requests/minute per IP  
✅ **Attempt Limiting** - Max 5 failed verification attempts  
✅ **Expiration** - OTP expires in 5 minutes  
✅ **JWT** - Stateless token authentication  
✅ **CORS** - Frontend origin validation  
✅ **Email Validation** - Regex pattern matching  

---

## 📝 Files Structure

```
backend/python-services/otp-auth/
├── main.py              # FastAPI application (269 lines)
├── config.py           # Settings configuration
├── models.py           # Dataclasses and validation
├── database.py         # MongoDB async connection
├── auth.py             # JWT token management
├── utils.py            # OTP, email, hashing utilities
├── requirements.txt    # Python dependencies
├── .env               # Configuration (from .env.example)
├── .env.example       # Configuration template
├── README.md          # Full documentation
├── setup.sh           # Automated setup script
└── venv/              # Python virtual environment
```

---

## 🎓 Learning Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Motor (Async MongoDB):** https://motor.readthedocs.io/
- **JWT Auth:** https://pyjwt.readthedocs.io/
- **Email in Python:** https://docs.python.org/3/library/email.html

---

## 🚀 Next Steps

1. ✅ Move OTP system to backend (COMPLETED)
2. ✅ Configure and test OTP API
3. ⏳ Integrate OTP with NestJS backend
4. ⏳ Update frontend to use OTP service
5. ⏳ Deploy to production

---

## 📞 Support

For issues or questions:
1. Check README.md in `backend/python-services/otp-auth/`
2. Review API docs at `http://localhost:8000/docs`
3. Check server logs in `/tmp/`
4. Verify .env configuration

---

**Last Updated:** February 2, 2026  
**Status:** ✅ Ready for Development & Testing
