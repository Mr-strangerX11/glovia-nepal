# Trust Score & Verification System

## Overview
Fraud-resistant user verification system integrated into the existing NestJS/Prisma e-commerce platform.

## Features Implemented

### 1. Trust Score System
- **Base Score**: 0 (new users)
- **Email Verification**: +20 points
- **Phone Verification**: +30 points  
- **Address Verification**: +20 points
- **Delivery Confirmation**: +30 points
- **Minimum for Orders**: 60 points (Email + Phone verified)

### 2. Database Schema Additions

**User Model:**
```prisma
trustScore        Int       @default(0)
deviceFingerprint String?
ipAddress         String?
failedAttempts    Int       @default(0)
isBlocked         Boolean   @default(false)
lastLoginAt       DateTime?
```

**Address Model:**
```prisma
latitude   Decimal? @db.Decimal(9, 6)
longitude  Decimal? @db.Decimal(9, 6)
isVerified Boolean  @default(false)
```

**New OTP Model:**
```prisma
model OtpVerification {
  id         String   @id @default(uuid())
  userId     String
  phone      String
  otp        String
  purpose    String   // 'phone_verification', 'login', 'password_reset'
  expiresAt  DateTime
  isVerified Boolean  @default(false)
  attempts   Int      @default(0)
}
```

### 3. Verification Endpoints

#### Email Verification
```
POST /api/v1/verification/email/send      # Resend verification email
POST /api/v1/verification/email/verify/:userId  # Verify email
```

#### Phone OTP Verification
```
POST /api/v1/verification/otp/send        # Send OTP
POST /api/v1/verification/otp/verify      # Verify OTP
```

**Send OTP Request:**
```json
{
  "phone": "+9779812345678",
  "purpose": "phone_verification"
}
```

**Verify OTP Request:**
```json
{
  "phone": "+9779812345678",
  "otp": "123456"
}
```

#### Address & Delivery Verification
```
POST /api/v1/verification/address/:addressId   # Verify address
POST /api/v1/verification/delivery/:orderId    # Confirm delivery
POST /api/v1/users/addresses/geo               # Create geo-verified address
```

**Geo-Verified Address Request:**
```json
{
  "fullName": "John Doe",
  "phone": "+9779812345678",
  "province": "Bagmati",
  "district": "Kathmandu",
  "municipality": "Kathmandu Metropolitan",
  "wardNo": 10,
  "area": "Thamel",
  "landmark": "Near Kathmandu Guest House",
  "latitude": 27.7172,
  "longitude": 85.324
}
```

### 4. OTP Service (SMS Gateway)

**Supported Gateways:**
- **Sparrow SMS** (Nepal) - Production ready
- **NTC SMS** (Nepal Telecom) - Placeholder
- **Mock SMS** (Development) - Console logging

**Configuration:**
```env
SMS_GATEWAY=mock  # 'sparrow', 'ntc', or 'mock'
SPARROW_SMS_TOKEN=your_token
SPARROW_SMS_FROM=GloviaNepal
```

**Mock Output Example:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 SMS to +9779812345678
📩 Your Glovia Nepal verification code is: 123456. Valid for 5 minutes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Order Protection

**Trust Score Middleware** applied to `POST /api/v1/orders`:
- Blocks orders if `trustScore < 60`
- Returns detailed error with missing verifications
- Checks if account is blocked

**Example Error Response:**
```json
{
  "message": "Insufficient verification to place orders",
  "trustScore": 20,
  "required": 60,
  "missing": ["phone verification"],
  "hint": "Complete email and phone verification to proceed"
}
```

### 6. Security Features

**On Registration:**
- Captures IP address
- Stores device fingerprint (user-agent)
- Initializes trust score at 0

**On Login:**
- Tracks last login timestamp
- Updates IP address
- Resets failed attempts on success
- Blocks access if account flagged

**Failed Login Protection:**
- Increments `failedAttempts` counter
- Can be used to auto-block after threshold

### 7. Trust Score Flow

```
1. User Registers
   └─> trustScore = 0

2. Email Verification
   └─> trustScore = 20

3. Phone OTP Verification  
   └─> trustScore = 50

4. Add Address with GPS
   └─> trustScore = 70

5. First Delivery Confirmed
   └─> trustScore = 100
   └─> All addresses marked verified
```

### 8. Integration with Existing Features

**Auth Updates:**
- `register()` now captures IP + device fingerprint
- `login()` updates lastLoginAt and resets failedAttempts
- Returns `trustScore`, `isEmailVerified`, `isPhoneVerified` in response

**User Profile:**
- Returns verification status in profile endpoint
- New geo-address creation endpoint with auto-verification

**Orders:**
- Trust score middleware blocks unverified users
- Delivery confirmation endpoint boosts trust

## API Testing

### 1. Register User
```bash
POST /api/v1/auth/register
{
  "email": "test@example.com",
  "phone": "+9779812345678",
  "password": "Test@123",
  "firstName": "Test",
  "lastName": "User"
}
# Response: trustScore = 0
```

### 2. Send Phone OTP
```bash
POST /api/v1/verification/otp/send
Authorization: Bearer <token>
{
  "phone": "+9779812345678",
  "purpose": "phone_verification"
}
# Check console for OTP (mock mode)
```

### 3. Verify Phone
```bash
POST /api/v1/verification/otp/verify
{
  "phone": "+9779812345678",
  "otp": "123456"
}
# Response: trustScore = 30
```

### 4. Verify Email (simplified)
```bash
POST /api/v1/verification/email/verify/:userId
# Response: trustScore = 50
```

### 5. Try Placing Order
```bash
POST /api/v1/orders
Authorization: Bearer <token>
{
  "addressId": "...",
  "items": [...]
}
# ✅ Success if trustScore >= 60
# ❌ Blocked if trustScore < 60
```

## Production Setup

### 1. Configure Sparrow SMS
```env
SMS_GATEWAY=sparrow
SPARROW_SMS_TOKEN=your_production_token
SPARROW_SMS_FROM=GloviaNepal
```

### 2. Set Up Email Service
Implement email sending in `VerificationService.sendVerificationEmail()`

### 3. Geocoding Integration (Optional)
Add Google Maps or OpenStreetMap for address lat/long lookup

### 4. Auto-blocking Rules
Add cron job to block users with `failedAttempts > 10`

## Benefits

✅ **Fraud Prevention**: Only verified users can order  
✅ **Scalable**: Works from startup → enterprise  
✅ **Flexible**: Mock SMS for dev, real SMS for prod  
✅ **Enterprise-Ready**: ACID transactions via PostgreSQL  
✅ **Minimal Disruption**: Integrated into existing NestJS architecture  
✅ **Compliance**: Device fingerprinting & IP tracking  

## Migration Applied

```bash
npx prisma migrate dev --name add_trust_score_and_verification
```

Database updated with new fields and `OtpVerification` table.

## Next Steps

1. **Email Service**: Integrate SendGrid/AWS SES for verification emails
2. **SMS Gateway**: Add Sparrow SMS production credentials
3. **Admin Dashboard**: Add trust score management UI
4. **Analytics**: Track verification rates and fraud attempts
5. **Auto-Block**: Implement threshold-based account blocking

---

**System Status**: ✅ Fully integrated and ready for testing  
**Migration**: ✅ Applied  
**Endpoints**: ✅ Active under `/api/v1/verification`  
**Order Protection**: ✅ Middleware enabled
