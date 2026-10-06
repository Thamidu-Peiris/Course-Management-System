import { z } from "zod";

const deleteCourseSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/, "invalid course id type"),
});

export default deleteCourseSchema;
