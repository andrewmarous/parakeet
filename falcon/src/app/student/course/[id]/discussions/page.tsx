"use client";

import NoDiscussionEmptyState from "@/app/components/EmptyStates/NoDiscussionEmptyState/NoDiscussionEmptyState";
import CreatePostForm from "@/app/components/Forms/CreatePostForm/CreatePostForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DiscussionPage() {
  const searchParams = useSearchParams();
  const [createPost, setCreatePost] = useState(false);

  useEffect(() => {
    setCreatePost(searchParams.has("create-post"));
  }, [searchParams]);

  return <>{createPost ? <CreatePostForm /> : <NoDiscussionEmptyState />}</>;
}
