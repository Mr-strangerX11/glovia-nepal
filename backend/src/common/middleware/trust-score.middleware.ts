import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../database/prisma.service';

/**
 * Trust Score Guard Middleware
 * Prevents orders from users with insufficient verification
 */
@Injectable()
export class TrustScoreMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;

    if (!user || !user.id) {
      throw new ForbiddenException('Authentication required');
    }

    // Fetch user trust score
    const userRecord = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        trustScore: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isBlocked: true,
      },
    });

    if (!userRecord) {
      throw new ForbiddenException('User not found');
    }

    if (userRecord.isBlocked) {
      throw new ForbiddenException('Account blocked. Contact support.');
    }

    // Minimum trust score required: 60
    // Email (20) + Phone (30) + Address/Activity (10+) = 60+
    if (userRecord.trustScore < 60) {
      const missing = [];
      if (!userRecord.isEmailVerified) missing.push('email verification');
      if (!userRecord.isPhoneVerified) missing.push('phone verification');

      throw new ForbiddenException({
        message: 'Insufficient verification to place orders',
        trustScore: userRecord.trustScore,
        required: 60,
        missing,
        hint: 'Complete email and phone verification to proceed',
      });
    }

    next();
  }
}
