"use client";

import DirectoryDataTable from "@/app/components/DataTable/DirectoryDataTable/DirectoryDataTable";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourse } from "./actions";

export default function TeacherDirectoryPage() {
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | undefined>();

  useEffect(() => {
    const courseSlug = pathname.split("/")[3];
    getCourse(courseSlug).then((newCourseId) => {
      setCourseId(newCourseId);
    });
  }, [pathname]);

  return <>{courseId ? <DirectoryDataTable classId={courseId} /> : <></>}</>;
}
