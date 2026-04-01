import { z } from 'zod';

// User Validations
export const addUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleName: z.enum(["admin", "user"]).optional(),
});

export const subscribeUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().length(9, "Phone number must be 9 digits"),
});

export const updateUserValidation = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  role: z.enum(["admin", "user"]).optional(),
  subscribed: z.boolean().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});


export const loginValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Camera Validations
export const addCameraValidation = z.object({
  name: z.string().min(2).max(100),
  location: z.string().max(200),
  streamUrl: z.string("Must be a valid URL"),
});

export const updateCameraStatusValidation = z.object({
  id: z.string(),
  isActive: z.boolean(),
});

export const getCamerasValidation = z.object({
  location: z.string().optional(),
});

// Detection Validations
export const getDetectionValidation = z.object({
  cameraId: z.string().optional(),
  speciesId: z.string().optional(),
});

export const verifyDetectionValidation = z.object({
  id: z.string(),
  isVerified: z.boolean(),
});

export const recordDetectionValidation = z.object({
  cameraId: z.string(),
  speciesId: z.string(),
  confidence: z.number().min(0).max(1),
});


