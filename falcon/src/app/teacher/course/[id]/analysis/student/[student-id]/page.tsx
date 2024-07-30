"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/Breadcrumb/Breadcrumb";
import MetricsCard from "@/app/components/Cards/MetricsCard/MetricsCard";
import StudentTopicsCard from "@/app/components/Cards/StudentTopicsCard/StudentTopicsCard";
import StudentInsightsDataTable from "@/app/components/DataTable/StudentInsightsDataTable/StudentInsightsDataTable";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getStudentAnalyticsData } from "./actions";

interface StudentAnalyticsDataT {
  totalPrompts: Number;
  askingTheMostAbout: String;
  studentName: String;
}

export default function StudentAnalyticsPage() {
  const pathname = usePathname();
  const studentId = pathname.split("/").pop();
  const courseSlug = pathname.split("/")[3];
  const [data, setData] = useState<StudentAnalyticsDataT>({
    totalPrompts: 0,
    askingTheMostAbout: "",
    studentName: "",
  });

  useEffect(() => {
    getStudentAnalyticsData(courseSlug, studentId!).then((data) => {
      setData(data);
    });
  }, [courseSlug, studentId]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/teacher/course/${courseSlug}/analysis`}>
                Insights
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Student Insights</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h3 className="font-semibold text-xl text-grey-900">
          {data.studentName}
        </h3>
      </div>
      <div className="flex flex-row gap-8">
        <MetricsCard title="Total Prompts">
          <p className="text-2xl font-semibold">
            {data.totalPrompts.toString()}
          </p>
        </MetricsCard>
        <MetricsCard title="Asking the most about...">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 w-fit">
            <p className="text-lg font-semibold text-blue-800">
              {data.askingTheMostAbout}
            </p>
          </div>
        </MetricsCard>
        <MetricsCard title="Cohort">
          <p className="text-2xl font-semibold">DIS 205</p>
        </MetricsCard>
      </div>
      <div>
        <StudentTopicsCard />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-grey-900 mb-2">Prompts</h3>
        <StudentInsightsDataTable />
      </div>
    </div>
  );
}
