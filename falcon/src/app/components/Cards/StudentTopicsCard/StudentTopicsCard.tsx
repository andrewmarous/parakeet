"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import StudentTopicsBar from "../../Charts/StudentTopicsBar/StudentTopicsBar";
import { Card } from "../Base";
import { getStudentTopicsData } from "./actions";

type StudentTopicsData = {
  topic: string;
  num_prompts: number;
};

export default function StudentTopicsCard() {
  const [data, setData] = useState<StudentTopicsData[]>([]);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const studentId = pathname?.split("/").pop();

  useEffect(() => {
    getStudentTopicsData(courseSlug, studentId!).then((topic) => {
      setData(topic.slice(0, 5));
    });
  }, [courseSlug, studentId]);

  return (
    <Card className="p-6 flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="font-medium">Categorized Prompts</p>
      </div>
      <StudentTopicsBar data={data} />
    </Card>
  );
}
