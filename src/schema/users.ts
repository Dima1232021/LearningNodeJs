import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
})