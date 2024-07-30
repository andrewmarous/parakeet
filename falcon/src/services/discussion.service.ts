import db from "@/db";
import { discussions, replies } from "@/db/schema";
import { likes } from "@/db/schema/likes.schema";
import { userService } from "@/services";
import { Discussion } from "@/types";
import { and, desc, eq } from "drizzle-orm";

interface CreateDiscussionPostData {
  topic?: string;
  subject: string;
  content: string;
  visibility: "teachers" | "students" | "both";
  type: "question" | "post" | "announcement";
  isAnonymous: boolean;
  markdownContent: string;
}

const discussionService = {
  async create(courseId: string, uid: string, data: CreateDiscussionPostData) {
    const getPrevDiscussion = await db.query.discussions.findFirst({
      where: eq(discussions.course, courseId),
      orderBy: desc(discussions.idx),
    });

    const user = await userService.get(uid);

    const [{ id, idx }] = await db
      .insert(discussions)
      .values({
        posterName: user.firstName + " " + user.lastName,
        subject: data.subject,
        idx: getPrevDiscussion ? getPrevDiscussion.idx + 1 : 1,
        content: JSON.parse(data.content),
        tag: data.topic,
        visibility: data.visibility,
        course: courseId,
        poster: uid,
        type: data.type,
        isAnswered: false,
        markdownContent: data.markdownContent,
        isAnonymous: data.isAnonymous,
      })
      .returning({ id: discussions.id, idx: discussions.idx });

    return { id, idx };
  },

  async getDiscussions(courseId: string): Promise<Discussion[]> {
    const courseDiscussions = await db.query.discussions.findMany({
      where: eq(discussions.course, courseId),
      with: {
        likes: true,
        replies: {
          with: {
            likes: true,
          },
        },
      },
      orderBy: desc(discussions.idx),
    });

    return courseDiscussions;
  },

  async getDiscussionBySlug(
    courseId: string,
    slug: number
  ): Promise<Discussion> {
    const discussion = await db.query.discussions.findFirst({
      where: and(eq(discussions.course, courseId), eq(discussions.idx, slug)),
      with: {
        likes: true,
        replies: {
          with: {
            likes: true,
          },
        },
      },
    });

    if (!discussion) {
      throw new Error("Discussion not found");
    }

    return discussion;
  },

  async getDiscussionWithReplies(
    courseId: string,
    slug: number
  ): Promise<Discussion> {
    const discussionWReplies = await db.query.discussions.findFirst({
      where: and(eq(discussions.course, courseId), eq(discussions.idx, slug)),
      with: {
        likes: true,
        replies: {
          with: {
            likes: true,
            replies: {
              with: {
                likes: true,
                replies: {
                  with: {
                    likes: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!discussionWReplies) {
      throw new Error("Discussion not found");
    }

    return discussionWReplies;
  },

  async createReply(
    courseId: string,
    discussionId: string,
    uid: string,
    content: string,
    markdownContent: string,
    parent?: string
  ) {
    const user = await userService.get(uid);
    await db.insert(replies).values({
      content: JSON.parse(content),
      poster: uid,
      posterName: user.firstName + " " + user.lastName,
      course: courseId,
      discussion: parent ? null : discussionId,
      markdownContent: markdownContent,
      parent: parent,
    });
  },

  async likeDiscussion(discussionId: string, uid: string) {
    const _ = await db.insert(likes).values({
      userId: uid,
      discussionId: discussionId,
    });
  },

  async unlikeDiscussion(discussionId: string, uid: string) {
    const _ = await db
      .delete(likes)
      .where(and(eq(likes.userId, uid), eq(likes.discussionId, discussionId)));
  },

  async likeReply(discussionId: string, uid: string) {
    const _ = await db.insert(likes).values({
      userId: uid,
      replyId: discussionId,
    });
  },

  async unlikeReply(replyId: string, uid: string) {
    const _ = await db
      .delete(likes)
      .where(and(eq(likes.userId, uid), eq(likes.replyId, replyId)));
  },

  async markAnswer(discussionId: string, replyId: string) {
    await db
      .update(discussions)
      .set({ isAnswered: true })
      .where(and(eq(discussions.id, discussionId)));

    await db
      .update(replies)
      .set({ isAnswer: true })
      .where(and(eq(replies.id, replyId)));
  },

  async approveReply(replyId: string) {
    await db
      .update(replies)
      .set({ isApproved: true })
      .where(and(eq(replies.id, replyId)));
  },

  async editParakeetReply(replyId: string, newContent: string) {
    await db
      .update(replies)
      .set({ isApproved: true, markdownContent: newContent })
      .where(and(eq(replies.id, replyId)));
  },
};

export default discussionService;
