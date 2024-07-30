"use server";

import { TopicClusterColumnT } from "@/app/components/DataTable/TopicsClusterDataTable/TopicsClusterDataTable";
import { timeAgo } from "@/app/utils";
import { courseService, mediaService } from "@/services";

export async function getTopicTableData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const topicData = await courseService.getCourseCategories(courseId);
  return topicData;
}

export async function getQuestionCategories(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const categories = await courseService.getCourseCategories(courseId);

  const filteredCategories = categories.filter((category) => {
    return category.topic !== "Unknown";
  });

  let totalQuestions = filteredCategories.reduce(
    (acc, category) => acc + category.count,
    0
  );

  return {
    categories: filteredCategories,
    totalQuestions,
  };
}

export async function getTopicClusterData(
  courseSlug: string
): Promise<TopicClusterColumnT[]> {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const clusterData = await courseService.getClusters(courseId);
  return clusterData.map((cluster) => {
    return {
      cluster: cluster.label,
      id: cluster.id,
      num_questions: cluster.prompts.length,
      most_recent_question: timeAgo(cluster.mostRecent),
    };
  });
}

export async function getDocAccessedData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const mediaData = await mediaService.getCourseAccessData(courseId);

  return mediaData;
}
