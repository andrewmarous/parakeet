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
import UsageCard, {
  calculateEndIndex,
  UsageData,
} from "@/app/components/Cards/UsageCard/UsageCard";
import TopicInsightsDataTable from "@/app/components/DataTable/TopicInsightsDataTable/TopicInsightsDataTable";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMetrics, getUsageData } from "./actions";

interface TopicMetricsT {
  totalPrompts: Number;
  totalStudentsAsking: Number;
  percentageOfTotal: Number;
}

export default function TopicAnalyticsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const courseSlug = pathname.split("/")[3];
  const topic = searchParams.get("topic");
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [metrics, setMetrics] = useState<TopicMetricsT>({
    totalPrompts: 0,
    totalStudentsAsking: 0,
    percentageOfTotal: 0,
  });

  useEffect(() => {
    getMetrics(courseSlug, topic!).then((data) => {
      setMetrics(data);
    });

    getUsageData(courseSlug, topic!).then((data) => {
      setUsageData(data.slice(calculateEndIndex(7)));
    });
  }, [courseSlug, topic]);

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
              <BreadcrumbPage>Topic Insights</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h3 className="font-semibold text-lg text-grey-900">{topic}</h3>
      </div>
      <div className="flex flex-row gap-8">
        <MetricsCard title="Total questions asked">
          <p className="text-2xl font-semibold">{`${metrics.totalPrompts}`}</p>
        </MetricsCard>
        <MetricsCard title="Total students asking">
          <p className="text-2xl font-semibold">{`${metrics.totalStudentsAsking}`}</p>
        </MetricsCard>
        <MetricsCard title="Percentage of questions">
          <p className="text-2xl font-semibold">
            {`${metrics.percentageOfTotal}`}%
          </p>
        </MetricsCard>
      </div>
      <div className="w-full h-full">
        <UsageCard title={"Topic Usage"} data={usageData} />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-grey-900 mb-2">Prompts</h3>
        <TopicInsightsDataTable topic={topic!} />
      </div>
    </div>
  );
}
