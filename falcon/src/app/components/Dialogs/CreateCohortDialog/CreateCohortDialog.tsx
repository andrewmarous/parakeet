import { FaPlus } from "react-icons/fa6";
import AddCohortForm from "../../Forms/AddCohortForm/AddCohortForm";
import { Button } from "../../Inputs/Button/Button";
import { Dialog, DialogContent, DialogTrigger } from "../Base/Dialog";

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

export function AddCohortDialogContent() {
  return (
    <DialogContent className="w-[28rem]">
      <div>
        <PlusIcon />
      </div>
      <div className="mt-1 font-semibold text-lg">
        <h3>Create a cohort</h3>
        <p className="font-normal text-sm text-grey-600 mt-1">
          Enter the name for the cohort to create it.
        </p>
      </div>
      <div>
        <AddCohortForm />
      </div>
    </DialogContent>
  );
}
export default function AddCohortDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Add cohort <FaPlus />
        </Button>
      </DialogTrigger>
      <AddCohortDialogContent />
    </Dialog>
  );
}
