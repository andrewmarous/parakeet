"use client";

import AcademicIntegrityBar from "../../Charts/AcademicIntegrityBar/AcademicIntegrityBar";
import { Card } from "../Base";

export interface AiData {
  acceptable: number;
  warning: number;
  severe: number;
}

export default function AcademicIntegrityCard({ data }: { data: AiData }) {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <p className="font-medium">Academic Integrity Monitor</p>
      </div>
      {data.acceptable === 0 && data.warning === 0 && data.severe === 0 ? (
        <div className="px-4 py-2 rounded-lg bg-grey-100 mx-auto inset-shadow-transparent border border-grey-100">
          <p className="text-sm text-grey-700 mx-auto font-medium">
            No Prompts
          </p>
        </div>
      ) : (
        <AcademicIntegrityBar
          data={[
            { name: "Acceptable", value: data.acceptable },
            { name: "Warning", value: data.warning },
            { name: "Severe", value: data.severe },
          ]}
        />
      )}
    </Card>
  );
}
