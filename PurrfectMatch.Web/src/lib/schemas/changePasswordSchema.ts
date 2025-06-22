import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters long' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters long' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
