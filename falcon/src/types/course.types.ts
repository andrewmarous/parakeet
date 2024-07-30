import { InsertCourse, SelectCourse, SelectMedia } from "@/db/schema";

export type NewCourse = InsertCourse;

export type TeacherCourse = SelectCourse & {
  media: SelectMedia[];
  students: string[];
  teachers: string[];
};

export type StudentCourse = SelectCourse & {
  media: SelectMedia[];
};
