"use client";

import Link from "next/link";
import { useState } from "react";
import { reingestCourse } from "../actions/createCourse";

export default function ReingestCoursePage() {
  const [courseId, setCourseId] = useState("");

  return (
    <main className="container">
      <Link href="/">Home</Link>
      <h2>Reingest Entire Course</h2>
      <form className="form" action={reingestCourse}>
        <label>
          Course Id
          <input
            name="courseId"
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </label>
        <button type="submit">Reingest</button>
      </form>
    </main>
  );
}
