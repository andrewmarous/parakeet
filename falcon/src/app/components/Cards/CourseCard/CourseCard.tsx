import { StudentCourse } from "@/types";
import { Card } from "../Base";
import { getCourse } from "./actions/getCourse";

export type CourseCardProps =
  | {
      course: StudentCourse;
      id?: never;
    }
  | {
      course?: never;
      id: string;
    };

async function CourseCard({ course, id }: CourseCardProps) {
  if (id) {
    course = await getCourse(id);
  }

  return course ? (
    <Card
      className="w-80 pointer hover:pointer py-5 px-6"
      navigateTo={`/student/course/${course.slug}`}
      clickable
    >
      <div className="width-full flex flex-row justify-between items-center">
        <p className="font-medium font-lg">{course.code}</p>
      </div>
      <p className="text-sm text-grey-700">{course.name}</p>
    </Card>
  ) : (
    <>Loading</>
  );
}

export default CourseCard;
