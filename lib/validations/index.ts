import { z } from "zod";
import { CATEGORIES } from "@/types";

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(2, "Nickname must be at least 2 characters")
      .max(30, "Nickname must be under 30 characters")
      .regex(/^[a-zA-Z0-9_\s]+$/, "Only letters, numbers, spaces and underscores"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name must be at least 2 characters")
    .max(50, "Group name must be under 50 characters"),
});

export const joinGroupSchema = z.object({
  groupId: z.string().uuid("Invalid group ID format"),
});

export const expenseSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description too long"),
  amount: z
    .string()
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  expense_date: z.string(),
  paid_by: z.string().uuid(),
  split_type: z.enum(["equal", "exact", "percentage"]),
  shares: z.array(
    z.object({
      user_id: z.string().uuid(),
      amount: z.number().min(0),
      included: z.boolean().optional(),
    })
  ),
});

export const updateProfileSchema = z.object({
  nickname: z
    .string()
    .min(2, "Nickname must be at least 2 characters")
    .max(30, "Nickname must be under 30 characters")
    .regex(/^[a-zA-Z0-9_\s]+$/, "Only letters, numbers, spaces and underscores"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type JoinGroupFormData = z.infer<typeof joinGroupSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;