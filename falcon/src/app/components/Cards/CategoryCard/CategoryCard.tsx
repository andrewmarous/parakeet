import QuestionCategoriesPie from "../../Charts/QuestionCategoriesPie/QuestionCategoriesPie";
import Nib from "../../Nib/Nib";
import { Card } from "../Base";

export type CategoryData = {
  name: string;
  value: number;
};

type CategoryCardProps = {
  data: CategoryData[];
  totalPrompts: Number;
};

export default function CategoryCard({
  data,
  totalPrompts,
}: CategoryCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between">
        <p className="font-medium">Question Breakdown</p>
        <Nib text={`${totalPrompts} Total Questions`} variant={"primary"} />
      </div>
      <QuestionCategoriesPie data={data} />
    </Card>
  );
}
