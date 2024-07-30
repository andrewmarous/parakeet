import LockIcon from "@/assets/LockIcon";

export default function WIPEmptyState() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-full w-full">
      <LockIcon />
      <div>
        <p className="text-center text-xl font-semibold text-grey-800">
          This is a work in progress.
        </p>
        <p className="text-sm text-medium-grey justify-center text-center mt-1">
          We are currently building this. Please check back later.
        </p>
      </div>
    </div>
  );
}
