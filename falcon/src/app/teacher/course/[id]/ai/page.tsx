"use client";

import AcademicIntegrityCard, {
  AiData,
} from "@/app/components/Cards/AcademicIntegrityCard/AcademicIntegrityCard";
import AiInsightsDataTable, {
  AiInsightColumnT,
} from "@/app/components/DataTable/AiInsightsDataTable/AiInsightsDataTable";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAiInsightsData } from "./actions";

export default function AIPage() {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [aiCardData, setAiCardData] = useState<AiData>({
    acceptable: 0,
    warning: 0,
    severe: 0,
  });
  const [promptData, setPromptData] = useState<AiInsightColumnT[]>([]);

  useEffect(() => {
    getAiInsightsData(courseSlug).then((data) => {
      const aiData = data.reduce(
        (acc, prompt) => {
          if (prompt.prompts!.aiWarning === "Acceptable") {
            acc.acceptable += 1;
          } else if (prompt.prompts!.aiWarning === "Warning") {
            acc.warning += 1;
          } else if (prompt.prompts!.aiWarning === "Severe") {
            acc.severe += 1;
          }
          return acc; // Return the accumulator object
        },
        { acceptable: 0, warning: 0, severe: 0 }
      );
      setAiCardData(aiData);

      const cleanedData = data.map((prompt) => {
        return {
          id: prompt.prompts!.id,
          prompt: prompt.prompts!.prompt,
          response: prompt.prompts!.response,
          student: `${prompt.users?.firstName} ${prompt.users?.lastName}`,
          warningLevel: prompt.prompts!.aiWarning,
          studentId: prompt.users?.id!,
        };
      });
      setPromptData(cleanedData);
    });
  }, [courseSlug]);

  return (
    <div className="flex flex-col gap-8">
      <AcademicIntegrityCard data={aiCardData} />
      <div className="flex flex-col gap-1">
        <AiInsightsDataTable data={promptData} />
      </div>
    </div>
  );
}
