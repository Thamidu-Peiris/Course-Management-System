import { z } from "zod";

const createCourseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name too long"),

  instructor: z
    .string()
    .trim()
    .min(1, "Instructor is required")
    .max(150, "Instructor name too long"),

  courseCode: z.string().trim().min(1, "Course code is required"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category too long")
    .optional(),

  capacity: z
    .number()
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1"),

  fee: z.number().positive("Fee must be greater than 0"),

  status: z
    .enum(["ACTIVE", "INACTIVE"], { message: "Invalid status" })
    .optional(),
});

export default createCourseSchema;
