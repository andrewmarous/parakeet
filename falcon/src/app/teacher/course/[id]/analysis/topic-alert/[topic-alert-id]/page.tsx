"use client";

import TopicInsightsDataTable from "@/app/components/DataTable/TopicInsightsDataTable/TopicInsightsDataTable";
import { SelectPrompt } from "@/db/schema";
import { SelectClusters } from "@/db/schema/clusters.schema";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getTopicAlert } from "./actions";

type ClusterData = SelectClusters & {
  prompts: SelectPrompt[];
};

export default function TopicAlertPage() {
  const pathname = usePathname();
  const topicAlertId = pathname.split("/").pop();
  const courseSlug = pathname.split("/")[3];
  const [topicAlertData, setTopicAlertData] = useState<
    ClusterData | undefined
  >();

  useEffect(() => {
    getTopicAlert(courseSlug, topicAlertId!).then((data) => {
      setTopicAlertData(data);
    });
  });

  return (
    <>
      <h3 className="font-semibold text-lg">
        It seems like students are confused about {topicAlertData?.label}
      </h3>
      <div className="mt-8">
        <TopicInsightsDataTable cluster={topicAlertId} />
      </div>
    </>
  );
}
