import CreateExamForm from "../../Forms/CreateExamForm/CreateExamForm";
import { DialogContent } from "../Base/Dialog";

const PencilIcon = () => (
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
      d="M18.5 37.4998L24.0492 35.3655C24.4042 35.229 24.5816 35.1607 24.7477 35.0716C24.8952 34.9924 25.0358 34.901 25.168 34.7984C25.3169 34.6829 25.4513 34.5484 25.7202 34.2795L37 22.9998C38.1046 21.8952 38.1046 20.1044 37 18.9998C35.8954 17.8952 34.1046 17.8952 33 18.9998L21.7203 30.2795C21.4513 30.5484 21.3169 30.6829 21.2014 30.8318C21.0987 30.964 21.0074 31.1046 20.9282 31.2521C20.8391 31.4181 20.7708 31.5956 20.6343 31.9506L18.5 37.4998ZM18.5 37.4998L20.5581 32.1488C20.7054 31.7659 20.779 31.5744 20.9053 31.4867C21.0157 31.4101 21.1523 31.3811 21.2843 31.4063C21.4353 31.4351 21.5804 31.5802 21.8705 31.8703L24.1295 34.1294C24.4196 34.4195 24.5647 34.5645 24.5935 34.7155C24.6187 34.8475 24.5898 34.9841 24.5131 35.0945C24.4254 35.2208 24.234 35.2944 23.851 35.4417L18.5 37.4998Z"
      stroke="#5498FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CreateExamDialogContent() {
  return (
    <DialogContent className="min-w-[40rem]">
      <div>
        <PencilIcon />
      </div>
      <div className="mt-1 font-semibold text-lg">
        <h3>Create Content Review</h3>
        <p className="font-normal text-sm text-grey-600 mt-1">
          Create a practice exam to test your knowledge.
        </p>
      </div>
      <div>
        <CreateExamForm />
      </div>
    </DialogContent>
  );
}
