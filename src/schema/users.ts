import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
})

export const ValidationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long").max(50, "First name must not exceed 50 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters long").max(50, "Last name must not exceed 50 characters").optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters long").max(16, "New password cannot exceed 16 characters").optional(),
  confirmNewPassword: z.string().min(6, "Confirm new password must be at least 6 characters long").max(16, "Confirm new password cannot exceed 16 characters").optional(),
  currentPassword: z.string().optional(),
});