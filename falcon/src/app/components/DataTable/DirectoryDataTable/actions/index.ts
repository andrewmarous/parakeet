"use server";

import { courseService } from "@/services";
export async function getStudentsInClass(courseId: string) {
  const students = await courseService.getStudents(courseId);

  const data = students.map((student) => {
    return {
      id: student.id!,
      name: student.firstName! + " " + student.lastName!,
      email: student.email!,
      cohort: student.cohort ? student.cohort.name : "Unassigned",
    };
  });

  return data;
}

export async function getInviteCode(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const course = await courseService.getStudentCourse(courseId);

  return course.studentCode;
}
