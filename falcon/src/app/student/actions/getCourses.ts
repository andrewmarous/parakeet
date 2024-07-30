"use server";

import { studentService } from "@/services";
import { auth, clerkClient } from "@clerk/nextjs";

// Get the courses for currently logged in student
export default async function getCourses() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not logged in");
  const {
    privateMetadata: { uid },
  } = await clerkClient.users.getUser(userId);

  const courses = await studentService.getCourses(uid as string);

  return courses;
}
