"use server";

import { teacherService } from "@/services";
import { NewTeacher } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs";
import { OnboardingSchema } from "../OnboardingForm";

async function onboardTeacher(data: OnboardingSchema) {
  const { userId } = auth();
  if (!userId || !data.inviteCode) return null;

  const { firstName, lastName, emailAddresses } =
    await clerkClient.users.getUser(userId);

  const teacherId = await teacherService.create(
    {
      ...data,
      firstName,
      lastName,
      email: emailAddresses[0].emailAddress,
      cuid: userId,
    } as NewTeacher,
    data.inviteCode
  );

  const _ = await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "teacher",
      onboarding: "complete",
    },
    privateMetadata: {
      uid: teacherId,
    },
  });
}

export default onboardTeacher;
