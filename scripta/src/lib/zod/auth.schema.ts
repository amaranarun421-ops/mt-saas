import { z } from 'zod';

// zod v4 dropped `required_error` — use `{ error: '...' }` instead.
export const authSchema = z.object({
  firstName: z
    .string({ error: 'First name is required' })
    .min(1, 'First name is required')
    .trim(),
  lastName: z
    .string({ error: 'Last name is required' })
    .min(1, 'Last name is required')
    .trim(),
  email: z
    .string({ error: 'Email is required' })
    .email('Invalid email')
    .trim()
    .toLowerCase(),
  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .trim(),
});

export type authSchema = z.infer<typeof authSchema>;

export const authValidation = {
  register: authSchema,
  login: authSchema.pick({ email: true, password: true }),
  update: authSchema.omit({ email: true, password: true }),
  updatePasswordForm: z
    .object({
      oldPassword: authSchema.shape.password,
      newPassword: authSchema.shape.password,
      confirmNewPassword: authSchema.shape.password,
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      path: ['newPassword'],
      message: 'New password cannot be the same as the old password',
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      path: ['confirmNewPassword'],
      message: 'Passwords do not match',
    }),
  updatePasswordRoute: z
    .object({
      oldPassword: authSchema.shape.password,
      newPassword: authSchema.shape.password,
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      path: ['newPassword'],
      message: 'New password cannot be the same as the old password',
    }),
  forgotPasswordForm: authSchema.pick({ email: true }),
  resetPassword: z
    .object({
      newPassword: authSchema.shape.password,
      confirmNewPassword: authSchema.shape.password,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      path: ['confirmNewPassword'],
      message: 'Passwords do not match',
    }),
};

// ---- AI write-mode input schemas ----

export const blogInputSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters').max(300),
  tone: z.enum(['professional', 'casual', 'authoritative', 'friendly', 'persuasive']),
  length: z.enum(['short (~300 words)', 'medium (~600 words)', 'long (~1000 words)']),
  keywords: z.string().max(300).optional().default(''),
});

export const socialInputSchema = z.object({
  platform: z.enum(['instagram', 'linkedin', 'x']),
  topic: z.string().min(3).max(300),
  tone: z.enum(['professional', 'casual', 'witty', 'inspirational', 'bold']),
});

export const emailInputSchema = z.object({
  goal: z.enum(['welcome', 'promo', 'follow-up', 'announcement']),
  audience: z.string().min(3).max(300),
  keyPoint: z.string().min(3).max(500),
});

export const productInputSchema = z.object({
  product: z.string().min(2).max(200),
  features: z.string().min(3).max(1000),
  tone: z.enum(['confident', 'playful', 'luxurious', 'minimal', 'friendly']),
});

export type BlogInput = z.infer<typeof blogInputSchema>;
export type SocialInput = z.infer<typeof socialInputSchema>;
export type EmailInput = z.infer<typeof emailInputSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;

export const inputSchemaByMode = {
  blog: blogInputSchema,
  social: socialInputSchema,
  email: emailInputSchema,
  product: productInputSchema,
} as const;
