"use server";

import { userService } from "@/services";
import { getUid } from "@/utils";

export default async function isValidUser() {
  const uid = await getUid();
  const user = await userService.get(uid);
  const userEmailDomain = user.email.split("@")[1];

  const validEmails = ["cornell.edu", "tryparakeet.com"];

  return validEmails.includes(userEmailDomain);
}
