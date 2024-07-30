import QueriedDocsBar from "../../Charts/QueriedDocsBar/QueriedDocsBar";
import { Card } from "../Base";

export type DocAccessedData = {
  doc_name: string;
  times_accessed: number;
};

export type QueriedDocsProps = {
  data: DocAccessedData[];
};

export default function QueriedDocsCard({ data }: QueriedDocsProps) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="font-medium">Frequently Accessed Documents</p>
      </div>
      <QueriedDocsBar data={data} />
    </Card>
  );
}
