"use server";

import { studentService } from "@/services";
import { NewStudent } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs";
import { OnboardingSchema } from "../OnboardingForm";

async function onboardStudent(data: OnboardingSchema) {
  const { userId } = auth();
  if (!userId) return null;
  const { firstName, lastName, emailAddresses } =
    await clerkClient.users.getUser(userId);

  const studentId = await studentService.create({
    ...data,
    firstName,
    lastName,
    email: emailAddresses[0].emailAddress,
    cuid: userId,
  } as NewStudent);

  const _ = await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "student",
      onboarding: "complete",
    },
    privateMetadata: {
      uid: studentId,
    },
  });
}

export default onboardStudent;
