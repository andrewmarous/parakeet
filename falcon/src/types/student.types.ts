import { InsertStudent, SelectStudent } from "@/db/schema";
import { NewUser, User } from ".";

export type NewStudent = Omit<InsertStudent & NewUser, "id"> & {
  role: "student";
};
export type Student = SelectStudent &
  User & {
    role: "student";
  };
