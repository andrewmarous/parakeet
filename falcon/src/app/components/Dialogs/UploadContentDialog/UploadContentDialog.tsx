"use client";

import { LuUpload } from "react-icons/lu";
import UploadContentForm from "../../Forms/UploadContentForm/UploadContentForm";
import { Button } from "../../Inputs/Button/Button";
import { Dialog, DialogContent, DialogTrigger } from "../Base/Dialog";

const UploadIcon = () => (
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
      d="M37 31V32.2C37 33.8802 37 34.7202 36.673 35.362C36.3854 35.9265 35.9265 36.3854 35.362 36.673C34.7202 37 33.8802 37 32.2 37H23.8C22.1198 37 21.2798 37 20.638 36.673C20.0735 36.3854 19.6146 35.9265 19.327 35.362C19 34.7202 19 33.8802 19 32.2V31M33 24L28 19M28 19L23 24M28 19V31"
      stroke="url(#paint0_linear_646_1963)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_646_1963"
        x1="28"
        y1="19"
        x2="28"
        y2="37"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#61A0FF" />
        <stop offset="1" stopColor="#4590FF" />
      </linearGradient>
    </defs>
  </svg>
);

export default function UploadContentDialog({
  isPublic,
}: {
  isPublic: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Upload Content <LuUpload />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40rem]">
        <div>
          <UploadIcon />
        </div>
        <div className="mt-1 font-semibold text-lg">
          <h3>Upload Content</h3>
          <p className="font-normal text-sm text-grey-600 mt-1">
            Upload a new {isPublic ? "public" : "private"} piece of content.
          </p>
        </div>
        <div>
          <UploadContentForm isPublic={isPublic} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
