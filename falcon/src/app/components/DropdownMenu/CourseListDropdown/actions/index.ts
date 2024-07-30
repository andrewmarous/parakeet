"use server";

import {
  courseService,
  studentService,
  teacherService,
  userService,
} from "@/services";
import { Role, StudentCourse, TeacherCourse } from "@/types";

async function getCourse(
  slug: string
): Promise<StudentCourse | TeacherCourse | undefined> {
  if (slug === undefined) return undefined;
  const courseId = await courseService.getCourseIdBySlug(slug);
  const role = await userService.getRole();
  if (role === Role.TEACHER) {
    const course = await courseService.getTeacherCourse(courseId);
    return course;
  }

  const course = await courseService.getStudentCourse(courseId);

  return course;
}

async function getCourses(): Promise<StudentCourse[] | TeacherCourse[]> {
  const userId = await userService.getUid();
  const role = await userService.getRole();

  if (role === Role.TEACHER) {
    const courseIds = (await teacherService.getCourses(userId)).map(
      (course) => course.courseId!
    );

    const filteredCourseIds = courseIds.filter(
      (courseId) => courseId !== undefined
    );

    const courses = await courseService.getTeacherCourses(filteredCourseIds);

    return courses;
  } else {
    const courseIds = (await studentService.getCourses(userId)).map(
      (course) => course.courseId!
    );

    const courses = await courseService.getStudentCourses(courseIds);

    return courses;
  }
}

export { getCourse, getCourses };
