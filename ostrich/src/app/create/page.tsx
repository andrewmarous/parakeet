"use client";

import Link from "next/link";
import { useState } from "react";
import createCourse from "../actions/createCourse";

export default function CreatePage() {
  const [courseSchool, setCourseSchool] = useState("")
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [topics, setTopics] = useState("");

  return (
    <main className="container">
      <Link href="/">Home</Link>
      <h2>Create Course</h2>
      <form className="form" action={createCourse}>
        <label>
          School of Origin
          <input
              name="courseSchool"
              type="text"
              value={courseSchool}
              onChange={(e) => setCourseSchool(e.target.value)}
          />
        </label>
        <label>
          Course Name
          <input
            name="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </label>
        <label>
          Course Code
          <input
            name="courseCode"
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
        </label>
        <label>
          Topics (comma-separated list of topics)
          <input
            name="topics"
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
        </label>
        <label>
          Upload course content (PDFs only)
          <input name="files" type="file" multiple />
        </label>
        <button type="submit">Create Course</button>
      </form>
    </main>
  );
}
