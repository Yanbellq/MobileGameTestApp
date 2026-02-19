import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Required'),
  password: z.string().min(8, 'At least 8 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(6, 'At least 6 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'At least 8 characters'),
});

type TLoginFormData = z.infer<typeof loginSchema>;
type TRegisterFormData = z.infer<typeof registerSchema>;

export type { TLoginFormData, TRegisterFormData };