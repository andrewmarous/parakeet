"use client";

import Link from "next/link";
import { useState } from "react";
import { analyzeCourse } from "../actions/createCourse";

export default function AnalyzePage() {
  const [courseId, setCourseId] = useState("");

  return (
    <main className="container">
      <Link href="/">Home</Link>
      <h2>Analyze Course</h2>
      <form className="form" action={analyzeCourse}>
        <label>
          Course Id
          <input
            name="courseId"
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </label>
        <label className="checkboxContainer">
          Reclassify
          <input name="reclassify" type="checkbox" />
        </label>
        <button type="submit">Analyze</button>
      </form>
    </main>
  );
}
