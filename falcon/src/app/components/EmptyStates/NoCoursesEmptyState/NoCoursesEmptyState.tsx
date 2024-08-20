import NoCoursesEmptyStateIcon from "./NoCourseEmptyStateIcon";

export default function NoCoursesEmptyState() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-full w-full">
      <NoCoursesEmptyStateIcon />
      <div>
        <p className="text-center text-xl font-semibold text-grey-800">
          No Courses Yet
        </p>
        <p className="text-sm text-medium-grey justify-center text-center mt-1">
          Enter a course invite code to add one. <br />
          Text (404) 580-5480 or email andrewmarous@gmail.com to get a course code.
        </p>
      </div>
    </div>
  );
}
