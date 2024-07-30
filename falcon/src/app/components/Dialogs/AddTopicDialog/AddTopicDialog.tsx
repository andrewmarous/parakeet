import { FaPlus } from "react-icons/fa6";
import { Button } from "../../Inputs/Button/Button";
import { Dialog, DialogContent, DialogTrigger } from "../Base/Dialog";

const CourseIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="48" height="48" rx="24" fill="#D8E8FF" />
    <rect
      x="4"
      y="4"
      width="48"
      height="48"
      rx="24"
      stroke="#EBF3FF"
      strokeWidth="8"
    />
    <path
      d="M33 30.5001V27.4945C33 27.315 33 27.2253 32.9727 27.146C32.9485 27.076 32.9091 27.0122 32.8572 26.9592C32.7986 26.8993 32.7183 26.8592 32.5578 26.779L28 24.5001M20 25.5001V32.3067C20 32.6786 20 32.8645 20.058 33.0274C20.1093 33.1713 20.1929 33.3016 20.3024 33.4082C20.4262 33.5287 20.5953 33.6062 20.9334 33.7612L27.3334 36.6945C27.5786 36.8069 27.7012 36.8631 27.8289 36.8853C27.9421 36.9049 28.0579 36.9049 28.1711 36.8853C28.2988 36.8631 28.4214 36.8069 28.6666 36.6945L35.0666 33.7612C35.4047 33.6062 35.5738 33.5287 35.6976 33.4082C35.8071 33.3016 35.8907 33.1713 35.942 33.0274C36 32.8645 36 32.6786 36 32.3067V25.5001M18 24.5001L27.6422 19.679C27.7734 19.6134 27.839 19.5806 27.9078 19.5677C27.9687 19.5562 28.0313 19.5562 28.0922 19.5677C28.161 19.5806 28.2266 19.6134 28.3578 19.679L38 24.5001L28.3578 29.3212C28.2266 29.3868 28.161 29.4196 28.0922 29.4325C28.0313 29.4439 27.9687 29.4439 27.9078 29.4325C27.839 29.4196 27.7734 29.3868 27.6422 29.3212L18 24.5001Z"
      stroke="#3C8AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function AddTopicDialogContent() {
  return (
    <DialogContent className="w-[28rem]">
      <div>
        <CourseIcon />
      </div>
      <div className="mt-1 font-semibold text-lg">
        <h3>Add a Topic</h3>
        <p className="font-normal text-sm text-grey-600 mt-1">
          Enter a new topic name.
        </p>
      </div>
      <div>
        {/* <AddTopicForm /> */}
      </div>
    </DialogContent>
  );
}
export default function AddTopicDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Add Topic <FaPlus />
        </Button>
      </DialogTrigger>
      <AddTopicDialogContent />
    </Dialog>
  );
}
