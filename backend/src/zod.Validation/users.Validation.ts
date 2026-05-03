import z from "zod";
import { is } from "zod/locales";

export const addUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(9, "Phone number must be at least 9 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleName: z.enum(["admin", "user"]).optional(),
});
export const subscribeUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().length(9, "Phone number must be 9 digits"),
  organizationId: z.string().min(5, "Organization ID is required"),
});

// update user

export const updateUserValidation = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  email: z.email("Invalid email address").optional(),
  phone: z.string().min(9, "Phone number must be at least 9 digits").optional(),
  roleName: z.enum(["admin", "user"]).optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  subscribed: z.boolean().optional(),
});

export const getUserValidation = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  roleName: z.enum(["admin", "user"]).optional(),
  organizationId: z.string().optional(),
});

export const loginValidation = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateSubscriberValidation = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  email: z.email("Invalid email address").optional(),
  phone: z.string().min(9, "Phone number must be at least 9 digits").optional(),
  subscribed: z.boolean().optional(),
  isActive: z.boolean().optional(),
  organizationId: z.string().min(5, "Organization ID is required").optional(),
  isDeleted: z.boolean().optional(),
});
