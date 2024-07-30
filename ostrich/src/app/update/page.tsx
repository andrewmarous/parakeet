"use client";

import Link from "next/link";
import { useState } from "react";
import { updateCourse } from "../actions/createCourse";

export default function UpdateCoursePage() {
  const [courseId, setCourseId] = useState("");

  return (
    <main className="container">
      <Link href="/">Home</Link>
      <h2>Update Course with more Content</h2>
      <form className="form" action={updateCourse}>
        <label>
          Course Id
          <input
            name="courseId"
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </label>
        <label>
          Upload course content
          <input name="files" type="file" multiple />
        </label>
        <button type="submit">Update</button>
      </form>
    </main>
  );
}
