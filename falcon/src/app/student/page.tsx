import Image from "next/image";
import Link from "next/link";
import { FaRegBell } from "react-icons/fa6";
import CourseCard from "../components/Cards/CourseCard/CourseCard";
import AddClassDialog from "../components/Dialogs/AddClassDialog/AddClassDialog";
import ProfileDropdown from "../components/DropdownMenu/ProfileDropdown/ProfileDropdown";
import NoCoursesEmptyState from "../components/EmptyStates/NoCoursesEmptyState/NoCoursesEmptyState";
import { NavigationBar } from "../components/NavigationBar/NavigationBar";
import getCourses from "./actions/getCourses";

export default async function StudentDashboardPage() {
  const courses = await getCourses();

  return (
    <>
      <NavigationBar
        leftElement={
          <Link href={"/student"} className="cursor-pointer" tabIndex={0}>
            <Image src={"/logo.svg"} alt={"logo"} width={18} height={18} />
          </Link>
        }
        rightElement={
          <div className="flex flex-row gap-8 items-center">
            <AddClassDialog />
            <FaRegBell color="#586474" path="1.5" />
            <ProfileDropdown />
          </div>
        }
      />
      <main className="p-12">
        {courses.length === 0 ? (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <NoCoursesEmptyState />
          </div>
        ) : (
          <div className="grid md:grid-cols-4 sm:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.courseId} id={course.courseId!!} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
