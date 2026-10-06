import prisma from "../lib/prisma.js";
import { ErrorHandler } from "../middlewares/Errorhandler.js";

const formatCourse = (course) => ({
  id: course.id,
  name: course.name,
  instructor: course.instructor,
  courseCode: course.courseCode,
  category: course.category,
  capacity: course.capacity,
  fee: course.fee,
  status: course.status,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
});

export const CreateCourse = async (req, res) => {
  try {
    const { name, instructor, courseCode, category, capacity, fee, status } =
      req.body;

    const existingCourse = await prisma.course.findFirst({
      where: {
        courseCode,
      },
    });

    const errors = {};

    if (existingCourse && existingCourse.courseCode === courseCode) {
      errors.courseCode = "Course code already exists";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(409).json({
        success: false,
        message: Object.values(errors).join(", "),
        errors,
      });
    }

    await prisma.course.create({
      data: {
        name,
        instructor,
        courseCode,
        category: category || "General",
        capacity,
        fee,
        status: status || "ACTIVE",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    if (error.code == "P2002") {
      return res.status(409).json({
        success: false,
        message: "Course code already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const GetAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { id: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses.map(formatCourse),
    });
  } catch (error) {
    ErrorHandler(error, req, res);
  }
};

export const UpdateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, instructor, courseCode, category, capacity, fee, status } =
      req.body;

    if (!parseInt(id)) {
      return res.json({ msg: "invalid course id type" });
    }

    const exist = await prisma.course.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!exist) {
      return res.status(404).json({
        success: false,
        message: "course id not found",
      });
    }

    const existCourseCode = await prisma.course.findFirst({
      where: {
        courseCode: courseCode,
        NOT: { id: parseInt(id) },
      },
    });

    if (existCourseCode) {
      return res.status(409).json({
        success: false,
        message: "Course code already exists",
      });
    }

    const existCourseName = await prisma.course.findFirst({
      where: {
        name: name,
        NOT: { id: parseInt(id) },
      },
    });

    if (existCourseName) {
      return res.status(409).json({
        success: false,
        message: "name already exists",
      });
    }

    const updated = await prisma.course.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        instructor,
        courseCode,
        category,
        capacity,
        fee,
        status: status || "ACTIVE",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: formatCourse(updated),
    });
  } catch (error) {
    ErrorHandler(error, req, res);
  }
};

export const DeleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!parseInt(id)) {
      return res.json({ msg: "invalid course id type" });
    }

    const courseId = parseInt(id);

    const exist = await prisma.course.findFirst({
      where: { id: courseId },
    });

    if (!exist) {
      return res.status(404).json({
        success: false,
        message: "course id not found",
      });
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    ErrorHandler(error, req, res);
  }
};
