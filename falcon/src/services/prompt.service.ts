import db from "@/db";
import { prompts, users } from "@/db/schema";
import { clusters } from "@/db/schema/clusters.schema";
import { NewPrompt } from "@/types/prompt.types";
import { and, eq, inArray, sql } from "drizzle-orm";
import { courseService } from ".";

const promptService = {
  async addPrompt(newPrompt: NewPrompt): Promise<string> {
    const [{ id }] = await db
      .insert(prompts)
      .values(newPrompt)
      .returning({ id: prompts.id });

    return id;
  },

  async getUsageByClass(courseId: string) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const formattedDate = threeMonthsAgo.toISOString().split("T")[0];

    const query = sql`
    SELECT 
      date_series.date AS prompt_date,
      COALESCE(pc.prompt_count, 0) AS prompt_count
    FROM 
      (SELECT generate_series(CURRENT_DATE - INTERVAL '93 days', CURRENT_DATE, '1 day')::date AS date) AS date_series
    LEFT JOIN 
      (SELECT DATE(created) AS prompt_date, COUNT(*) AS prompt_count 
      FROM prompts 
      WHERE course_id = ${courseId} AND created >= CURRENT_DATE - INTERVAL '93 days'
      GROUP BY prompt_date) AS pc
    ON date_series.date = pc.prompt_date
    ORDER BY date_series.date;`;

    const responses = await db.execute(query);
    const usage = responses.map(({ prompt_date, prompt_count }) => ({
      day: prompt_date,
      usage: prompt_count,
    }));

    return usage as { day: string; usage: number }[];
  },

  async getUsageByTopic(courseId: string, topic: string) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const formattedDate = threeMonthsAgo.toISOString().split("T")[0];

    const query = sql`
    SELECT 
      date_series.date AS prompt_date,
      COALESCE(pc.prompt_count, 0) AS prompt_count
    FROM 
      (SELECT generate_series(CURRENT_DATE - INTERVAL '93 days', CURRENT_DATE, '1 day')::date AS date) AS date_series
    LEFT JOIN 
      (SELECT DATE(created) AS prompt_date, COUNT(*) AS prompt_count 
      FROM prompts 
      WHERE course_id = ${courseId} AND created >= CURRENT_DATE - INTERVAL '93 days' AND topic = ${topic}
      GROUP BY prompt_date) AS pc
    ON date_series.date = pc.prompt_date
    ORDER BY date_series.date;`;

    const responses = await db.execute(query);
    const usage = responses.map(({ prompt_date, prompt_count }) => ({
      day: prompt_date,
      usage: prompt_count,
    }));

    return usage as { day: string; usage: number }[];
  },

  async getTotalByTopic(courseId: string, topic: string) {
    const response = await db
      .select({ count: sql`COUNT(*)`.mapWith(Number) })
      .from(prompts)
      .where(
        sql`course_id = ${courseId} AND topic = ${topic} AND analysis_complete = true`
      );

    return response[0].count as number;
  },

  async getTotalStudentsAskingByTopic(courseId: string, topic: string) {
    const response = await db
      .select({ count: sql`COUNT(DISTINCT student_id)`.mapWith(Number) })
      .from(prompts)
      .where(
        sql`course_id = ${courseId} AND topic = ${topic} AND analysis_complete = true`
      )
      .groupBy(prompts.studentId);

    return response.length as number;
  },

  async getQuestionsAskingPercentage(courseId: string, topic: string) {
    const totalPromptsByTopic = await this.getTotalByTopic(courseId, topic);

    const courseCategories = await courseService.getCourseCategories(courseId);

    let total = 0;
    courseCategories.forEach((category) => {
      total += category.count;
    });

    return (totalPromptsByTopic / total) * 100;
  },

  async getPromptsByTopic(courseId: string, topic: string) {
    const topicPrompts = await db
      .select()
      .from(prompts)
      .fullJoin(users, eq(users.id, prompts.studentId))
      .where(
        sql`course_id = ${courseId} AND topic = ${topic} AND analysis_complete = true`
      );

    return topicPrompts;
  },

  async getPromptsByCluster(courseId: string, cluster: string) {
    const clusterPrompts = await db.query.clusters.findFirst({
      where: and(eq(clusters.course, courseId), eq(clusters.id, cluster)),
      with: {
        prompts: {
          with: {
            user: true,
          },
        },
      },
    });

    return clusterPrompts;
  },

  async getPromptsByStudent(courseId: string, studentId: string) {
    const studentPrompts = await db
      .select()
      .from(prompts)
      .where(sql`course_id = ${courseId} AND student_id = ${studentId}`);
    return studentPrompts;
  },

  async getPromptsByCohort(courseId: string, students: string[]) {
    // get all prompts where student id that posted prompt is in students in cohort

    const studentPrompts = await db.query.prompts.findMany({
      where: and(
        eq(prompts.courseId, courseId),
        inArray(prompts.studentId, students)
      ),
    });

    return studentPrompts;
  },

  async getPromptById(id: string) {
    const promptData = await db.query.prompts.findFirst({
      where: eq(prompts.id, id),
    });
    if (!promptData) {
      throw new Error("Prompt not found");
    }
    return promptData;
  },

  async verify(id: string) {
    await db.update(prompts).set({ approved: true }).where(eq(prompts.id, id));
  },

  async editResponse(id: string, response: string) {
    await db
      .update(prompts)
      .set({ response, approved: true })
      .where(eq(prompts.id, id));
  },
};

export default promptService;
