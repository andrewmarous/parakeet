"use server";

import { discussionService } from "@/services";
import { getUid } from "@/utils";

export async function likeReply(replyId: string, isLiked: boolean) {
  const uid = await getUid();
  if (!isLiked) {
    const _ = await discussionService.likeReply(replyId, uid);
  } else {
    const _ = await discussionService.unlikeReply(replyId, uid);
  }
}

export async function edit(replyId: string, content: string) {
  await discussionService.editParakeetReply(replyId, content);
}

export async function approve(replyId: string) {
  const _ = await discussionService.approveReply(replyId);
}

export async function markAsAnswer(replyId: string, discussionId: string) {
  await discussionService.markAnswer(discussionId, replyId);
}
