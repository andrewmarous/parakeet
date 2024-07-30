import { FaPencil } from "react-icons/fa6";

export default function NoPracticeEmptyState({
  noMessage = false,
}: {
  noMessage?: boolean;
}) {
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-full w-full">
      <div className="flex flex-row items-center justify-center p-8 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 border border-blue-100 inset-shadow-transparent w-fit rounded-2xl">
        <FaPencil className="h-12 w-12 fill-blue-600" />
      </div>
      <div>
        <p className="text-center text-xl font-semibold text-grey-800">
          No practice materials yet
        </p>
        {!noMessage && (
          <p className="text-sm text-medium-grey justify-center text-center mt-1">
            Create practice material to study and get better at your course.
          </p>
        )}
      </div>
    </div>
  );
}
