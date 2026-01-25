import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OtpService } from './otp.service';
import { SendOtpDto, OtpPurpose } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private otpService: OtpService,
  ) {}

  /**
   * Send verification email
   */
  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    // TODO: Implement email service integration
    // For now, just mark as placeholder
    console.log(`[Email Verification] Sending to ${email} for user ${userId}`);
  }

  /**
   * Verify email using token
   */
  async verifyEmail(userId: string): Promise<{ message: string; trustScore: number }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      return { message: 'Email already verified', trustScore: user.trustScore };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        trustScore: { increment: 20 },
      },
    });

    return {
      message: 'Email verified successfully',
      trustScore: updatedUser.trustScore,
    };
  }

  /**
   * Send OTP to phone
   */
  async sendOtp(dto: SendOtpDto, userId?: string): Promise<{ message: string }> {
    const { phone, purpose } = dto;

    // Find user by phone
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user && !userId) {
      throw new NotFoundException('User not found');
    }

    const targetUserId = userId || user.id;

    // Check for existing pending OTP
    const existingOtp = await this.prisma.otpVerification.findFirst({
      where: {
        userId: targetUserId,
        phone,
        purpose,
        expiresAt: { gt: new Date() },
        isVerified: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Rate limiting: max 1 OTP per minute
    if (existingOtp) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      if (existingOtp.createdAt > oneMinuteAgo) {
        throw new BadRequestException('Please wait before requesting another OTP');
      }
    }

    // Generate OTP
    const otp = this.otpService.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP
    await this.prisma.otpVerification.create({
      data: {
        userId: targetUserId,
        phone,
        otp,
        purpose,
        expiresAt,
      },
    });

    // Send OTP
    const sent = await this.otpService.sendOtp(phone, otp, purpose);

    if (!sent) {
      throw new BadRequestException('Failed to send OTP');
    }

    return { message: 'OTP sent successfully' };
  }

  /**
   * Verify OTP
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string; trustScore: number }> {
    const { phone, otp } = dto;

    // Find user
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find matching OTP
    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        userId: user.id,
        phone,
        otp,
        isVerified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      // Increment failed attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: { increment: 1 } },
      });

      throw new BadRequestException('Invalid or expired OTP');
    }

    // Check max attempts
    if (otpRecord.attempts >= 5) {
      throw new BadRequestException('Maximum verification attempts exceeded');
    }

    // Mark OTP as verified
    await this.prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isVerified: true },
    });

    // Update user: verify phone and increase trust score
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
        trustScore: { increment: 30 },
        failedAttempts: 0,
      },
    });

    return {
      message: 'Phone verified successfully',
      trustScore: updatedUser.trustScore,
    };
  }

  /**
   * Increment trust score for address verification
   */
  async verifyAddress(userId: string, addressId: string): Promise<{ message: string; trustScore: number }> {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Mark address as verified
    await this.prisma.address.update({
      where: { id: addressId },
      data: { isVerified: true },
    });

    // Increment trust score
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { trustScore: { increment: 20 } },
    });

    return {
      message: 'Address verified successfully',
      trustScore: updatedUser.trustScore,
    };
  }

  /**
   * Confirm delivery (final trust boost)
   */
  async confirmDelivery(userId: string, orderId: string): Promise<{ message: string; trustScore: number }> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Mark all user addresses as verified after successful delivery
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isVerified: true },
    });

    // Big trust boost for completed delivery
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { trustScore: { increment: 30 } },
    });

    return {
      message: 'Delivery confirmed. User marked as genuine.',
      trustScore: updatedUser.trustScore,
    };
  }
}
