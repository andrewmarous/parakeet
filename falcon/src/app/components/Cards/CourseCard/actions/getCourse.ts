"use server";

import { courseService } from "@/services";
import { StudentCourse } from "@/types";

export async function getCourse(id: string): Promise<StudentCourse> {
  const course = await courseService.getStudentCourse(id);

  return course;
}
