"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/Breadcrumb/Breadcrumb";
import ExamForm from "@/app/components/Forms/ExamForm/ExamForm";
import IconBubble from "@/app/components/IconBubble/IconBubble";
import { Question } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import { getExam } from "./actions";

export default function ExamPage() {
  const pathname = usePathname();
  const examId = pathname.split("/")[6];
  const courseSlug = pathname.split("/")[3];
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState("");
  const [score, setScore] = useState<number>();
  const [topics, setTopics] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getExam(examId)
      .then((data) => {
        setName(data?.name!);
        setTopics(data?.topics!.split(",").join(", ")!);
        setQuestions((data?.content as { [key: string]: any })?.questions);
      })
      .then(() => {
        setLoading(false);
      });
  }, [examId]);

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
    <div className="max-w-[800px] mx-auto  w-full">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/student/course/${courseSlug}/practice`}>
              Study Material
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Review Content</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-row gap-2 items-center">
          <IconBubble Icon={FaPencil} size="sm" />
          <div>
            <p className="font-medium text-grey-800">{name}</p>
            <p className="text-xs text-grey-600 max-w-[600px] truncate">
              Topics: {topics}
            </p>
          </div>
        </div>
        {score?.toString() ? (
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-100 inset-shadow-transparent px-4 py-2 rounded-xl">
            <p className="font-medium text-purple-800">{score}%</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="h-[1px] bg-grey-200 my-4 w-full"></div>
      <ExamForm questions={questions} setScore={(score) => setScore(score)} />
    </div>
  );
}
