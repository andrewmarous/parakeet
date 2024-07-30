"use client";

import Image from "next/image";
import Link from "next/link";
import "./main.css";

export default function Home() {
  return (
    <main className="container">
      <h1>Ostrich</h1>
      <ul>
        <li>
          <Link href="/create">Create a new course</Link>
        </li>
        <li>
          <Link href="/update">Update an existing course</Link>
        </li>
        <li>
          <Link href="/reingest">Reingest an existing course</Link>
        </li>
        <li>
          <Link href="/analyze">Analyze a course</Link>
        </li>
        <li>
          <Link href="/topic-alert">Compute topic clusters for course</Link>
        </li>
      </ul>
      <Image
        src="/ostrich.jpeg"
        alt="ostrich"
        className="image"
        width={700}
        height={320}
      />
    </main>
  );
}
