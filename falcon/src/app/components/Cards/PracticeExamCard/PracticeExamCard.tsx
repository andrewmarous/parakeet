"use client";

import { SelectExam } from "@/db/schema/exams.schema";
import { useUser } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { IoDocumentText } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Tooltip/Tooltip";

export default function PracticeExamCard({ exam }: { exam: SelectExam }) {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];

  const router = useRouter();
  return (
    <div
      key={exam.id}
      onClick={() =>
        router.push(`/${role}/course/${courseSlug}/practice/exam/${exam.id}`)
      }
      className="flex flex-row justify-between w-94 items-center py-3 px-5 rounded-lg bg-white shadow-sm border border-grey-200 cursor-pointer hover:ring-2 hover:ring-blue-200 active:bg-gradient-to-br active:from-blue-50 active:to-blue-100 "
    >
      <div className="flex flex-row">
        <div className="w-9 h-9 min-w-9 min-h-9 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 inset-shadow-transparent border border-blue-100 rounded-lg">
          <IoDocumentText className="fill-blue-700 w-4 h-4" />
        </div>

        <div className="flex flex-col ml-4">
          <p className="text-grey-800 text-sm font-medium line-clamp-1">
            {exam.name}
          </p>
          <p className="text-grey-600 text-xs">
            {(exam.content as { [key: string]: any }).questions.length}{" "}
            questions
          </p>
        </div>
      </div>
      <div>
        {exam.approved && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <div className="w-6 h-6 min-w-6 min-h-6 bg-gradient-to-br from-green-100 to-green-200 border border-green-100 inset-shadow-transparent-sm flex flex-row justify-center items-center rounded-lg">
                  <Check className="w-3 h-3 stroke-green-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-96">
                <p className="text-grey-800">
                  This exam has been approved by your professor.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
