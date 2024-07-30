"use client";

import Link from "next/link";
import { useState } from "react";
import { topicAnalysis } from "../actions/createCourse";

export default function TopicAlertPage() {
  const [courseId, setCourseId] = useState("");
  return (
    <main className="container">
      <Link href="/">Home</Link>
      <h2>Calculate Course Topic Clusters</h2>
      <form className="form" action={topicAnalysis}>
        <label>
          Course Id
          <input
            name="courseId"
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </label>
        <button type="submit">Analyze Clusters</button>
      </form>
    </main>
  );
}
