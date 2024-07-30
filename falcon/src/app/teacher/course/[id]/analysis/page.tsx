"use client";

import CategoryCard, {
  CategoryData,
} from "@/app/components/Cards/CategoryCard/CategoryCard";
import QueriedDocsCard, {
  DocAccessedData,
} from "@/app/components/Cards/QueriedDocsCard/QueriedDocsCard";
import CohortDataTable from "@/app/components/DataTable/CohortDataTable/CohortDataTable";
import TopicsClusterDataTable, {
  TopicClusterColumnT,
} from "@/app/components/DataTable/TopicsClusterDataTable/TopicsClusterDataTable";
import TopicsDataTable, {
  TopicColumnT,
} from "@/app/components/DataTable/TopicsDataTable/TopicsDataTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/Tabs/Tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/Tooltip/Tooltip";
import { timeAgo } from "@/app/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaCubesStacked, FaExclamation, FaPeopleGroup } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import {
  getDocAccessedData,
  getQuestionCategories,
  getTopicClusterData,
  getTopicTableData,
} from "./actions";

export default function TeacherAnalysisPage() {
  const [topicData, setTopicData] = useState<TopicColumnT[]>([]);
  const [clusterData, setClusterData] = useState<TopicClusterColumnT[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totalPrompts, setTotalPrompts] = useState<Number>(0);
  const [queriedDocsData, setQueriedDocsData] = useState<DocAccessedData[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const courseSlug = pathname.split("/")[3];

  useEffect(() => {
    setLoading(true);
    getTopicTableData(courseSlug).then((data) => {
      const cleanedData = data.map((topic, idx) => ({
        id: idx.toString(),
        topic: topic.topic,
        num_questions: topic.count,
        most_recent_question: timeAgo(new Date(topic.mostRecent)),
      }));
      setTopicData(cleanedData);
    });

    getQuestionCategories(courseSlug).then((data) => {
      setTotalPrompts(data.totalQuestions);
      const categories = data.categories;
      setCategoryData(
        categories.map((category) => ({
          name: category.topic,
          value: category.count,
        }))
      );
    });

    getDocAccessedData(courseSlug).then((data) => {
      setQueriedDocsData(
        data
          .map((doc) => ({
            doc_name: doc.name,
            times_accessed: doc.retrieved,
          }))
          .slice(0, 5)
      );
    });

    getTopicClusterData(courseSlug).then((data) => {
      setClusterData(data);
    });
    setLoading(false);
  }, [courseSlug]);

  return loading ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Oval
        visible={true}
        height="54"
        width="54"
        color="#313149"
        secondaryColor="rgba(0,0,0,0)"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
      />
    </div>
  ) : (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row justify-between gap-8">
        <div className="flex flex-1">
          <CategoryCard totalPrompts={totalPrompts} data={categoryData} />
        </div>
        <div className="flex flex-1">
          <QueriedDocsCard data={queriedDocsData} />
        </div>
      </div>
      <div className="w-full h-[1px] bg-grey-300"></div>
      <Tabs defaultValue="topics">
        <div className="flex flex-row gap-3">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="topics" className="flex flex-row gap-2">
              <FaCubesStacked />
              Topics
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="flex flex-row gap-2">
              <FaPeopleGroup />
              Cohorts
            </TabsTrigger>
            <TabsTrigger value="topic_alert" className="flex flex-row gap-2">
              <FaExclamation />
              Topic Alerts
            </TabsTrigger>
          </TabsList>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AiOutlineQuestionCircle className="w-4 h-4 fill-grey-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-96">
                <p className="text-grey-800">
                  View analytics on cohorts and topics.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <TabsContent value="cohorts" className="w-full">
          <CohortDataTable />
        </TabsContent>
        <TabsContent value="topics">
          <TopicsDataTable data={topicData} />
        </TabsContent>
        <TabsContent value="topic_alert">
          <TopicsClusterDataTable data={clusterData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
