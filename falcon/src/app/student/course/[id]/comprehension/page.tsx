"use client";

import CategoryCard, {
  CategoryData,
} from "@/app/components/Cards/CategoryCard/CategoryCard";
import MetricsCard from "@/app/components/Cards/MetricsCard/MetricsCard";
import QueriedDocsCard, {
  DocAccessedData,
} from "@/app/components/Cards/QueriedDocsCard/QueriedDocsCard";
import WIPEmptyState from "@/app/components/EmptyStates/WIPEmptyState/WIPEmptyState";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getQuestionCategories } from "./actions";

export default function ComprehensionPage() {
  const pathname = usePathname();
  const courseSlug = pathname.split("/")[3];

  const [queriedDocsData, setQueriedDocsData] = useState<DocAccessedData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totalPrompts, setTotalPrompts] = useState<Number>(0);

  useEffect(() => {
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
  }, [courseSlug]);

  return true ? (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <WIPEmptyState />
    </div>
  ) : (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-8">
        <MetricsCard title="Total Prompts">
          <p className="text-2xl font-semibold">{totalPrompts.toString()}</p>
        </MetricsCard>
        <MetricsCard title="Asking the most about...">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 w-fit">
            <p className="text-lg font-semibold text-blue-800">
              {/* {data.askingTheMostAbout} */}
            </p>
          </div>
        </MetricsCard>
        <MetricsCard title="# of Students">
          <p className="text-2xl font-semibold">Figure this out</p>
        </MetricsCard>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <CategoryCard data={categoryData} totalPrompts={totalPrompts} />
        <QueriedDocsCard data={queriedDocsData} />
      </div>
    </div>
  );
}
