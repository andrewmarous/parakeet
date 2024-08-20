"use server";

import { UTApi } from "uploadthing/server";

import { generateCourseHash, generateSlug } from "@/utils";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

interface FileEsque extends Blob {
  name: string;
  customId?: string;
}

export default async function createCourse(formData: FormData) {
  const utapi = new UTApi();
  const client = await pool.connect();

  const courseSchool = formData.get("courseSchool")
  const courseName = formData.get("courseName");
  const courseCode = formData.get("courseCode");
  const topics = (formData.get("topics") as string).split(",");
  const files = formData.getAll("files") as FileEsque[];

  const response = await utapi.uploadFiles(files);

  const fileObjs = response.map((res: any) => {
    return {
      name: res.data.name,
      url: res.data.url,
      key: res.data.key,
    };
  });

  let fileMap: { [key: string]: string } = {};
  response.forEach((res: any) => {
    fileMap[res.data.name] = res.data.key;
  });

  const [studentHash, teacherHash] = generateCourseHash(
    courseName as string,
    courseCode as string
  );

  const slug = generateSlug(courseName as string, courseCode as string);

  const sqlResponse = await client.query(
    `INSERT INTO courses (teacher_code, student_code, slug, name, code, topics, school)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, // Assuming you want to return the inserted row
    [teacherHash, studentHash, slug, courseName, courseCode, topics, courseSchool]
  );

  const courseId = sqlResponse.rows[0].id;

  fileObjs.forEach(async (mediaObj) => {
    await client.query(
      `INSERT INTO media (key, name, course_id, url)
       VALUES ($1, $2, $3, $4);`,
      [mediaObj.key, mediaObj.name, courseId, mediaObj.url]
    );
  });

  const ragFormData = new FormData();

  // Append files to the FormData instance
  files.forEach((file) => {
    ragFormData.append("files", file, fileMap[file.name]);
  });

  const ragResponse = await fetch(
    `http://localhost:8000/api/v1/courses/${courseId}/ingest`,
    {
      method: "POST",
      body: ragFormData,
    }
  );
}

export async function updateCourse(formData: FormData) {
  const utapi = new UTApi();
  const client = await pool.connect();

  const courseId = formData.get("courseId");
  const files = formData.getAll("files") as FileEsque[];

  const response = await utapi.uploadFiles(files);

  const fileObjs = response.map((res: any) => {
    return {
      name: res.data.name,
      url: res.data.url,
      key: res.data.key,
    };
  });

  let fileMap: { [key: string]: string } = {};
  response.forEach((res: any) => {
    fileMap[res.data.name] = res.data.key;
  });

  fileObjs.forEach(async (mediaObj) => {
    await client.query(
      `INSERT INTO media (key, name, course_id, url)
       VALUES ($1, $2, $3, $4);`,
      [mediaObj.key, mediaObj.name, courseId, mediaObj.url]
    );
  });

  const ragFormData = new FormData();

  // Append files to the FormData instance
  files.forEach((file) => {
    ragFormData.append("files", file, fileMap[file.name]);
  });

  const ragResponse = await fetch(
    `http://localhost:8000/api/v1/courses/${courseId}/ingest`,
    {
      method: "POST",
      body: ragFormData,
    }
  );
}

export async function reingestCourse(formData: FormData) {
  // FETC
  const courseId = formData.get("courseId");
  const client = await pool.connect();

  const { rows } = await client.query(
    `Select key from media where course_id = $1;`,
    [courseId]
  );

  const keys = rows.map((row) => row.key);

  const utapi = new UTApi();
  const fileUrlObjs = await utapi.getFileUrls(keys);
  const fileUrls: string[] = fileUrlObjs.map((res: any) => {
    return res.url;
  });

  const ragResponse = await fetch(
    `http://localhost:8000/api/v1/courses/${courseId}/reingest`,
    {
      method: "POST",
      body: JSON.stringify({
        files: fileUrls,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function analyzeCourse(formData: FormData) {
  // FETC
  const courseId = formData.get("courseId");
  const reclassify = formData.get("reclassify") ? true : false;

  const ragResponse = fetch(
    `http://localhost:8000/api/v1/courses/${courseId}/analysis?reclassify=${reclassify}`,
    {
      method: "GET",
    }
  );
}

export async function topicAnalysis(formData: FormData) {
  // FETC
  const courseId = formData.get("courseId");

  const ragResponse = fetch(
    `http://localhost:8000/api/v1/courses/${courseId}/topic-alert`,
    {
      method: "GET",
    }
  );
}
