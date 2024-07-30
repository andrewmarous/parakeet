import { FaPlus } from "react-icons/fa6";
import PostAnnouncementForm from "../../Forms/PostAnnouncementForm/PostAnnouncementForm";
import { Button } from "../../Inputs/Button/Button";
import { Dialog, DialogContent, DialogTrigger } from "../Base/Dialog";

const AnnouncmentIcon = () => (
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
      d="M38 23.9999V27.9999M26.25 21.4999H22.8C21.1198 21.4999 20.2798 21.4999 19.638 21.8269C19.0735 22.1145 18.6146 22.5735 18.327 23.1379C18 23.7797 18 24.6198 18 26.2999L18 27.4999C18 28.4318 18 28.8977 18.1522 29.2653C18.3552 29.7553 18.7446 30.1447 19.2346 30.3477C19.6022 30.4999 20.0681 30.4999 21 30.4999V34.7499C21 34.9821 21 35.0982 21.0096 35.1959C21.1032 36.1455 21.8544 36.8968 22.804 36.9903C22.9017 36.9999 23.0178 36.9999 23.25 36.9999C23.4822 36.9999 23.5983 36.9999 23.696 36.9903C24.6456 36.8968 25.3968 36.1455 25.4904 35.1959C25.5 35.0982 25.5 34.9821 25.5 34.7499V30.4999H26.25C28.0164 30.4999 30.1772 31.4468 31.8443 32.3556C32.8168 32.8857 33.3031 33.1508 33.6216 33.1118C33.9169 33.0756 34.1402 32.943 34.3133 32.701C34.5 32.4401 34.5 31.9179 34.5 30.8736V21.1262C34.5 20.0819 34.5 19.5598 34.3133 19.2988C34.1402 19.0568 33.9169 18.9242 33.6216 18.888C33.3031 18.849 32.8168 19.1141 31.8443 19.6443C30.1772 20.553 28.0164 21.4999 26.25 21.4999Z"
      stroke="url(#paint0_linear_646_1963)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_646_1963"
        x1="28"
        y1="18.8843"
        x2="28"
        y2="36.9999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#63A1FF" />
        <stop offset="1" stopColor="#3C8AFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default function PostAnnouncementDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">
          Post Announcement <FaPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[48rem]">
        <div>
          <AnnouncmentIcon />
        </div>
        <div className="mt-1 font-semibold text-lg">
          <h3>Post Announcment</h3>
          <p className="font-normal text-sm text-grey-600 mt-1">
            Post an announcement that will be seen by the students in your
            class.
          </p>
        </div>
        <div>
          <PostAnnouncementForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
