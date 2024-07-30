"use server";

import { courseService, studentService, teacherService } from "@/services";
import { RoleT } from "@/types";
import { getUid } from "@/utils";
import { redirect } from "next/navigation";

export default async function addCourse(courseCode: string, role: RoleT) {
  const uid = await getUid();
  const roleEndpoint = role === "teacher" ? "teacher" : "student";

  if (role === "student") {
    const courseId = await studentService.addCourse(uid, courseCode);

    if (!courseId) return false;

    const course = await courseService.getStudentCourse(courseId);

    redirect(`/${roleEndpoint}/course/${course.slug}`);
  } else {
    const courseId = await teacherService.addCourse(uid, courseCode);

    if (!courseId) return false;

    const course = await courseService.getTeacherCourse(courseId);

    redirect(`/${roleEndpoint}/course/${course.slug}/dashboard`);
  }
}

export async function getCourses() {
  return await courseService.getAllStudentCourses();
}
