import { LuBarChartBig } from "react-icons/lu";

export default function NoPollsEmptyState() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-full w-full">
      <div className="flex flex-row items-center justify-center p-8 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 border border-blue-100 inset-shadow-transparent w-fit rounded-2xl">
        <LuBarChartBig className="h-12 w-12 stroke-blue-600" />
      </div>
      <div>
        <p className="text-center text-xl font-semibold text-grey-800">
          No polls yet
        </p>
        <p className="text-sm text-medium-grey justify-center text-center mt-1">
          Create a poll group to get start making polls.
        </p>
      </div>
    </div>
  );
}
