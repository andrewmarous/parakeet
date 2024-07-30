"use client";
import { StudentCourse, TeacherCourse } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircleDot, FaPlus } from "react-icons/fa6";
import { LuChevronsUpDown } from "react-icons/lu";
import { AddClassDialogContent } from "../../Dialogs/AddClassDialog/AddClassDialog";
import { Dialog, DialogTrigger } from "../../Dialogs/Base/Dialog";
import { Button, buttonVariants } from "../../Inputs/Button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Base/DropdownMenu";

import { useUser } from "@clerk/nextjs";
import { getCourse, getCourses } from "./actions";

export default function CourseListDropdown() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const roleEndpoint = role === "teacher" ? "teacher" : "student";

  const pathname = usePathname();
  const [currentCourse, setCurrentCourse] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [courses, setCourses] = useState<StudentCourse[] | TeacherCourse[]>([]);

  useEffect(() => {
    const courseSlug = pathname?.split("/")[3];
    getCourse(courseSlug)
      .then((course: StudentCourse | TeacherCourse | undefined) => {
        if (!course) return undefined;
        setCurrentCourse(course.code + ": " + course.name);
        return course;
      })
      .then((newCurrentCourse: StudentCourse | TeacherCourse | undefined) => {
        getCourses().then((courses: StudentCourse[] | TeacherCourse[]) => {
          setCourses(courses);
        });
      });
  }, [pathname, role]);

  return currentCourse && courses ? (
    <Dialog>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button className={buttonVariants({ variant: "secondary" })}>
            {currentCourse}
            <LuChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" sideOffset={5}>
          <DialogTrigger asChild onClick={() => setDropdownOpen(false)}>
            <DropdownMenuItem className="font-medium flex flex-row gap-2">
              Add Class <FaPlus />
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          {courses.length === 0 ? (
            <DropdownMenuLabel className="text-center font-medium text-medium-grey">
              No Courses
            </DropdownMenuLabel>
          ) : (
            <>
              {courses.map((course) => {
                const endpoint =
                  role === "teacher"
                    ? `/${roleEndpoint}/course/${course.slug}/dashboard`
                    : `/${roleEndpoint}/course/${course.slug}`;
                return (
                  <DropdownMenuItem key={course.code}>
                    <Link
                      href={endpoint}
                      className="flex flex-row items-center gap-2"
                    >
                      {course.code === currentCourse.split(":")[0] ? (
                        <FaCircleDot className="w-2" />
                      ) : (
                        <></>
                      )}
                      {course.code + ": " + course.name}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AddClassDialogContent />
    </Dialog>
  ) : (
    <></>
  );
}
