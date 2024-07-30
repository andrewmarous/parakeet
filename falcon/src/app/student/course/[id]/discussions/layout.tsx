import DiscussionSidebar from "@/app/components/Sidebar/DiscussionSidebar/DiscussionSidebar";
import { PropsWithChildren } from "react";

export default function DiscussionLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-row w-full">
      <DiscussionSidebar />
      <div className="flex flex-col w-full grow px-4">
        <main
          className="w-full h-full p-12 relative overflow-y-scroll"
          style={{ maxHeight: "calc(100vh - 7.3rem)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
