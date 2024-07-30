"use client";

import NoPollsEmptyState from "@/app/components/EmptyStates/NoPollsEmptyState/NoPollsEmptyState";
import { Button } from "@/app/components/Inputs/Button/Button";
import { TextInput } from "@/app/components/Inputs/TextInput/TextInput";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { getPolls } from "./actions";

export default function TeacherPollsPage() {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [pollGroups, setPollGroups] = useState([]);

  useEffect(() => {
    getPolls(courseSlug).then((data) => {
      setPollGroups(data);
    });
  }, [courseSlug]);

  return (
    <>
      <div className="w-full justify-between flex flex-row">
        <TextInput placeholder="Entery group name..." className="w-[20rem]" />
        <Button variant="secondary">
          Create Poll <FaPlus />
        </Button>
      </div>
      {pollGroups.length > 0 ? (
        <div className="w-full grid-cols-3 grid mt-8">hi</div>
      ) : (
        <div className="mt-24">
          <NoPollsEmptyState />
        </div>
      )}
    </>
  );
}
