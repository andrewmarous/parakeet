"use server";

import { promptService } from "@/services";

export async function verify(promptId: string) {
  const _ = await promptService.verify(promptId);

  // send email that email has been verified
  //   const _ = emailService.verify();
}

export async function editResponse(promptId: string, response: string) {
  const _ = await promptService.editResponse(promptId, response);
}
