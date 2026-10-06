import express from "express";
import {
  CreateCourse,
  DeleteCourse,
  GetAllCourses,
  UpdateCourse,
} from "../controller/course.controller.js";
import validate, { validateParams } from "../middlewares/validation/validatation.schema.js";
import createCourseSchema from "../middlewares/validation/createcourse.schema.js";
import updateCourseSchema, {
  updateCourseIdSchema,
} from "../middlewares/validation/updatecourse.schema.js";
import deleteCourseSchema from "../middlewares/validation/deletecourse.schema.js";

const CourseRoute = express.Router();

CourseRoute.post("/", validate(createCourseSchema), CreateCourse);
CourseRoute.get("/", GetAllCourses);
CourseRoute.put(
  "/:id",
  validateParams(updateCourseIdSchema),
  validate(updateCourseSchema),
  UpdateCourse
);
CourseRoute.delete("/:id", validateParams(deleteCourseSchema), DeleteCourse);

export default CourseRoute;
