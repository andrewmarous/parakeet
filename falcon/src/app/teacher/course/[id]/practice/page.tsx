"use client";

import PracticeExamCard from "@/app/components/Cards/PracticeExamCard/PracticeExamCard";
import NoPracticeEmptyState from "@/app/components/EmptyStates/NoPracticeEmptyState/NoPracticeEmptyState";
import { TextInput } from "@/app/components/Inputs/TextInput/TextInput";
import { SelectExam } from "@/db/schema/exams.schema";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { getPracticeData } from "./actions";

export default function TeacherPracticePage() {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [practiceContent, setPracticeContent] = useState<SelectExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPracticeData(courseSlug)
      .then((data) => {
        setPracticeContent(data);
      })
      .then(() => {
        setLoading(false);
      });
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
    <>
      <div>
        <TextInput
          placeholder="Enter practice content name..."
          className="w-[20rem]"
        />
      </div>

      <div className="mt-8 w-full">
        {practiceContent.length > 0 ? (
          <div className="grid grid-cols-4 gap-8">
            {practiceContent.map((content) => (
              <PracticeExamCard key={content.id} exam={content} />
            ))}
          </div>
        ) : (
          <div className="mt-24 flex flex-row justify-center w-full">
            <NoPracticeEmptyState noMessage />
          </div>
        )}
      </div>
    </>
  );
}
