-- Add VENDOR role to user_role enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'VENDOR';
