"use server";

import { courseService } from "@/services";

export async function getTopicAlert(courseSlug: string, clusterId: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);

  const cluster = await courseService.getCluster(courseId, clusterId);

  return cluster;
}
