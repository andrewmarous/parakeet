import { SelectDiscussion, SelectReply } from "@/db/schema";
import { SelectLike } from "@/db/schema/likes.schema";

export type Discussion = SelectDiscussion & {
  replies?: Reply[];
  likes: Like[];
};

export type Reply = SelectReply & {
  replies?: Reply[];
  likes: Like[];
};

export type Like = SelectLike;
