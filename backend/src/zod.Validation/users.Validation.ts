import z from "zod";

export const addUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleName: z.enum(["admin", "user"]).optional(),
});
export const subscribeUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

// update user

export const updateUserValidation = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.email("Invalid email address").optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  role: z.enum(["admin", "user"]).optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export const getUserValidation = z.object({
  id: z.string().optional(),
});
