import { InsertTeacher, SelectTeacher } from "@/db/schema";
import { NewUser, User } from ".";

export type NewTeacher = Omit<InsertTeacher & NewUser, "id"> & {
  role: "teacher";
};
export type Teacher = SelectTeacher &
  User & {
    role: "teacher";
  };
