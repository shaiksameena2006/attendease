import { z } from "zod";

// Authentication validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid institutional email" })
    .max(255, { message: "Email must be less than 255 characters" })
    .refine((email) => {
      // Add institutional email validation if needed
      // e.g., email.endsWith('@university.edu')
      return true;
    }, { message: "Please use your institutional email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Full name must contain only letters and spaces" }),
  role: z.enum(["student", "faculty", "admin"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile validation schemas
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  branch: z
    .string()
    .trim()
    .max(100, { message: "Branch must be less than 100 characters" })
    .optional(),
  year: z
    .number()
    .int()
    .min(1, { message: "Year must be at least 1" })
    .max(5, { message: "Year must be at most 5" })
    .optional(),
  department: z
    .string()
    .trim()
    .max(100, { message: "Department must be less than 100 characters" })
    .optional(),
  contact: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]+$/, { message: "Please enter a valid phone number" })
    .max(20, { message: "Contact must be less than 20 characters" })
    .optional(),
});

// Event validation schemas
export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(2000, { message: "Description must be less than 2000 characters" })
    .optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  location: z
    .string()
    .trim()
    .max(200, { message: "Location must be less than 200 characters" })
    .optional(),
  category: z
    .string()
    .trim()
    .max(50, { message: "Category must be less than 50 characters" })
    .optional(),
  capacity: z
    .number()
    .int()
    .min(1, { message: "Capacity must be at least 1" })
    .optional(),
});

// Message validation schemas
export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(5000, { message: "Message must be less than 5000 characters" }),
  conversationId: z.string().uuid({ message: "Invalid conversation ID" }),
});

// Certificate validation schemas
export const certificateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional(),
  userId: z.string().uuid({ message: "Invalid user ID" }),
});

// Timetable validation schemas
export const timetableEntrySchema = z.object({
  classId: z.string().uuid({ message: "Invalid class ID" }),
  dayOfWeek: z
    .number()
    .int()
    .min(0, { message: "Day must be between 0 and 6" })
    .max(6, { message: "Day must be between 0 and 6" }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format (use HH:MM)",
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format (use HH:MM)",
  }),
  roomId: z.string().uuid({ message: "Invalid room ID" }).optional(),
});

// Attendance validation schemas
export const attendanceSchema = z.object({
  sessionId: z.string().uuid({ message: "Invalid session ID" }),
  studentId: z.string().uuid({ message: "Invalid student ID" }),
  status: z.enum(["present", "absent", "late", "excused"], {
    errorMap: () => ({ message: "Invalid attendance status" }),
  }),
  verificationMethod: z
    .enum(["face_recognition", "bluetooth", "manual"], {
      errorMap: () => ({ message: "Invalid verification method" }),
    })
    .optional(),
});

// Club validation schemas
export const clubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Club name must be at least 3 characters" })
    .max(100, { message: "Club name must be less than 100 characters" }),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional(),
  category: z
    .string()
    .trim()
    .max(50, { message: "Category must be less than 50 characters" })
    .optional(),
});

// Transport validation schemas
export const busPassSchema = z.object({
  routeId: z.string().uuid({ message: "Invalid route ID" }),
  validFrom: z.date({ required_error: "Valid from date is required" }),
  validUntil: z.date({ required_error: "Valid until date is required" }),
});

// Helper function to sanitize HTML
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

// Helper function to encode URL parameters safely
export function encodeUrlParam(param: string): string {
  return encodeURIComponent(param);
}

// Type exports for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type CertificateFormData = z.infer<typeof certificateSchema>;
export type TimetableEntryFormData = z.infer<typeof timetableEntrySchema>;
export type AttendanceFormData = z.infer<typeof attendanceSchema>;
export type ClubFormData = z.infer<typeof clubSchema>;
export type BusPassFormData = z.infer<typeof busPassSchema>;
