import { z } from "zod";

const updateCourseSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(200, "Name too long")
      .optional(),

    instructor: z
      .string()
      .trim()
      .min(1, "Instructor is required")
      .max(150, "Instructor name too long")
      .optional(),

    courseCode: z.string().trim().min(1, "Course code is required").optional(),

    category: z
      .string()
      .trim()
      .min(1, "Category is required")
      .max(100, "Category too long")
      .optional(),

    capacity: z
      .number()
      .int("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1")
      .optional(),

    fee: z.number().positive("Fee must be greater than 0").optional(),

    status: z
      .enum(["ACTIVE", "INACTIVE"], { message: "Invalid status" })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const updateCourseIdSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/, "invalid course id type"),
});

export default updateCourseSchema;
