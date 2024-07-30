import db from "@/db";
import {
  cohorts,
  courses,
  media,
  prompts,
  studentCourses,
  users,
} from "@/db/schema";
import { clusters } from "@/db/schema/clusters.schema";
import { exams } from "@/db/schema/exams.schema";
import { StudentCourse, TeacherCourse } from "@/types";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import studentService from "./student.service";

const courseService = {
  async getStudentCourse(id: string): Promise<StudentCourse> {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, id),
      with: {
        media: true,
      },
    });
    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  },

  async getStudentCourses(courseIds: string[]): Promise<StudentCourse[]> {
    const studentCourses = await db.query.courses.findMany({
      where: inArray(courses.id, courseIds),
      with: {
        media: true,
      },
    });
    if (!courses) {
      throw new Error("Courses not found");
    }

    return studentCourses;
  },

  async getAllStudentCourses(): Promise<StudentCourse[]> {
    const studentCourses = await db.query.courses.findMany({
      with: {
        media: true,
      },
    });
    if (!studentCourses) {
      throw new Error("Courses not found");
    }
    return studentCourses;
  },

  async getTeacherCourse(id: string): Promise<TeacherCourse> {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, id),
      with: {
        media: true,
        teachers: true,
        students: true,
      },
    });
    if (!course) {
      throw new Error("Course not found");
    }

    const studentIds = course.students.map((student) => student.studentId);
    const teacherIds = course.teachers.map((teacher) => teacher.teacherId);

    return {
      ...course,
      teachers: teacherIds,
      students: studentIds,
    };
  },

  async getTeacherCourses(courseIds: string[]): Promise<TeacherCourse[]> {
    const teacherCourses = await db.query.courses.findMany({
      where: inArray(courses.id, courseIds),
      with: {
        media: true,
        teachers: true,
        students: true,
      },
    });
    if (!courses) {
      throw new Error("Courses not found");
    }

    const teacherIds = teacherCourses.map((course) =>
      course.teachers.map((teacher) => teacher.teacherId)
    );
    const studentIds = teacherCourses.map((course) =>
      course.students.map((student) => student.studentId)
    );

    return teacherCourses.map((course, index) => ({
      ...course,
      teachers: teacherIds[index],
      students: studentIds[index],
    }));
  },

  async getCourseIdBySlug(slug: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
    });
    if (!course) {
      throw new Error("Course not found");
    }

    return course.id;
  },

  async getSlugById(id: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, id),
    });
    if (!course) {
      throw new Error("Course not found");
    }

    return course.slug;
  },

  async getStudents(courseId: string) {
    const students = await db.query.studentCourses.findMany({
      where: eq(studentCourses.courseId, courseId),
      with: {
        cohort: true,
      },
    });

    const studentPromises = students.map((student) => {
      const studentData = studentService
        .get(student.studentId)
        .then((studentData) => {
          return {
            ...studentData,
            cohort: student.cohort,
          };
        });

      return studentData;
    });

    return Promise.all(studentPromises);
  },

  async getContent(courseId: string, isPublic: boolean) {
    const courseMedia = await db
      .select()
      .from(media)
      .where(sql`course_id = ${courseId} AND (is_public = ${isPublic})`);

    return courseMedia;
  },

  async getRecentPrompts(courseId: string, limit = 15) {
    const recentPrompts = await db
      .select()
      .from(prompts)
      .where(eq(prompts.courseId, courseId))
      .orderBy(desc(prompts.created))
      .limit(limit);

    return recentPrompts;
  },

  async getCourseCategories(courseId: string, studentId?: string) {
    const studentWhere = studentId
      ? sql` AND prompts.student_id = ${studentId}`
      : sql``;

    const query = sql`
    SELECT
      prompts.topic,
      COUNT(*) AS count,
      MAX(prompts.created) AS mostRecent,
      COUNT(CASE WHEN prompts.created > NOW() - INTERVAL '7 days' THEN 1 END) AS recentCount,
      COUNT(CASE WHEN prompts.created BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days' THEN 1 END) AS previousCount
    FROM
      prompts
    WHERE
      prompts.course_id = ${courseId} AND prompts.analysis_complete = true ${studentWhere}
    GROUP BY
      prompts.topic;`;

    type Category = {
      topic: string;
      count: number;
      mostrecent: Date;
      recentcount: number;
      previouscount: number;
    };

    const categories: Category[] = await db.execute(query);

    const formattedCategories = categories.map((category) => ({
      topic: category.topic,
      count: Number(category.count),
      mostRecent: new Date(category.mostrecent),
      recentCount: Number(category.recentcount),
      previousCount: Number(category.previouscount),
    }));

    return formattedCategories;
  },

  async getCohorts(courseId: string) {
    const cohortsData = await db.query.cohorts.findMany({
      where: eq(cohorts.course, courseId),
    });

    return cohortsData;
  },

  async getStudentCohort(courseId: string, studentId: string) {
    const cohort = await db.query.studentCourses.findFirst({
      where: and(
        eq(studentCourses.courseId, courseId),
        eq(studentCourses.studentId, studentId)
      ),
      with: {
        cohort: true,
      },
    });

    return cohort?.cohort;
  },

  async addStudentToCohort(
    courseId: string,
    cohortId: string,
    studentId: string
  ) {
    const _ = await db
      .update(studentCourses)
      .set({ cohort: cohortId })
      .where(
        and(
          eq(studentCourses.courseId, courseId),
          eq(studentCourses.studentId, studentId)
        )
      );
  },

  async getPrompts(courseId: string) {
    const coursePrompts = await db
      .select()
      .from(prompts)
      .fullJoin(users, eq(users.id, prompts.studentId))
      .where(sql`course_id = ${courseId} AND analysis_complete = true`);

    return coursePrompts;
  },

  async getTopics(courseId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const rawTopics = course?.topics;

    const topics = rawTopics
      .replace("{", "")
      .replace("}", "")
      .replace(/['"]+/g, "")
      .split(",")
      .map((topic) => topic.trim());

    return topics;
  },

  async getExams(courseId: string) {
    const examsO = await db.query.exams.findMany({
      where: eq(exams.courseId, courseId),
    });

    return examsO;
  },

  async getCohortStudents(courseId: string, cohortId: string) {
    const students = await db.query.studentCourses.findMany({
      where: and(
        eq(studentCourses.courseId, courseId),
        eq(studentCourses.cohort, cohortId)
      ),
    });

    return students;
  },

  async getClusters(courseId: string) {
    const courseClusters = await db.query.clusters.findMany({
      where: eq(clusters.course, courseId),
      with: {
        prompts: true,
      },
    });

    return courseClusters.map((cluster) => {
      const mostRecentPrompt = cluster.prompts.reduce((mostRecent, prompt) => {
        return mostRecent.created > prompt.created ? mostRecent : prompt;
      });
      return {
        ...cluster,
        mostRecent: mostRecentPrompt.created,
      };
    });
  },

  async getCluster(courseId: string, clusterId: string) {
    const cluster = await db.query.clusters.findFirst({
      where: and(eq(clusters.course, courseId), eq(clusters.id, clusterId)),
      with: {
        prompts: true,
      },
    });

    return cluster;
  },
};

export default courseService;
