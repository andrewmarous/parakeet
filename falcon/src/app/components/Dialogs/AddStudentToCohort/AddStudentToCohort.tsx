import AddStudentToCohortForm from "../../Forms/AddStudentToCohort/AddStudentToCohort";
import { Dialog, DialogContent } from "../Base/Dialog";

const PlusIcon = () => (
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
      d="M28 21V35M21 28H35"
      stroke="url(#paint0_linear_646_1963)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_646_1963"
        x1="28"
        y1="21"
        x2="28"
        y2="35"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4A92FF" />
        <stop offset="1" stopColor="#3D8AFF" />
        <stop offset="1.0001" stopColor="#2C5899" />
      </linearGradient>
    </defs>
  </svg>
);

export function AddStudentToCohortDialogContent({
  student,
}: {
  student: string;
}) {
  return (
    <DialogContent className="w-[28rem]">
      <div>
        <PlusIcon />
      </div>
      <div className="mt-1 font-semibold text-lg">
        <h3>Add student to cohort</h3>
        <p className="font-normal text-sm text-grey-600 mt-1">
          Add a student to a cohort.
        </p>
      </div>
      <div>
        <AddStudentToCohortForm student={student} />
      </div>
    </DialogContent>
  );
}
export default function AddStudentToCohort({
  onClose,
  open,
  student,
}: {
  onClose?: () => void;
  open?: boolean;
  student: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AddStudentToCohortDialogContent student={student} />
    </Dialog>
  );
}
