"use client";

import PromptFeedCard from "@/app/components/Cards/PromptFeedCard/PromptFeedCard";
import TopQuestionTopics from "@/app/components/Cards/TopQuestionTopicsCard/TopQuestionTopicsCard";
import UsageCard, {
  UsageData,
} from "@/app/components/Cards/UsageCard/UsageCard";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUsageData } from "./actions";

export default function TeacherDashboardPage() {
  const leftColRef = useRef<HTMLDivElement>(null);
  const courseSlug = usePathname().split("/")[3];
  const [usageData, setUsageData] = useState<UsageData[]>([]);

  useEffect(() => {
    getUsageData(courseSlug).then((data) => {
      setUsageData(data);
    });
  }, [courseSlug]);

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 w-full h-full">
      <div className="flex flex-col gap-8" ref={leftColRef}>
        <div>
          <UsageCard title={"Student Usage"} data={usageData} />
        </div>
        <div className="flex-grow">
          <TopQuestionTopics />
        </div>
      </div>
      <PromptFeedCard maxHeight={`${leftColRef.current?.offsetHeight}px`} />
    </div>
  );
}
