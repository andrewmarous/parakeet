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
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import getCohortData from "./actions";

interface CohortAnalyticsDataT {
  totalPrompts: Number;
  askingTheMostAbout: String;
  cohortName: String;
  numberOfStudents: Number;
}

export default function CohortAnalyticsPage() {
  const pathname = usePathname();
  const cohortId = pathname.split("/").pop();
  const courseSlug = pathname.split("/")[3];
  const [data, setData] = useState<CohortAnalyticsDataT>({
    totalPrompts: 0,
    askingTheMostAbout: "",
    cohortName: "",
    numberOfStudents: 0,
  });

  useEffect(() => {
    getCohortData(courseSlug, cohortId!).then((data) => {
      setData(data);
    });
  }, [courseSlug, cohortId]);

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
              <BreadcrumbPage>Cohort Insights</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h3 className="font-semibold text-xl text-grey-900">
          {data.cohortName}
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
        <MetricsCard title="# of Students">
          <p className="text-2xl font-semibold">
            {data.numberOfStudents.toString()}
          </p>
        </MetricsCard>
      </div>
    </div>
  );
}
