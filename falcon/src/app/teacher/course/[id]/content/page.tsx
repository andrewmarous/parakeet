import CourseContentDataTable from "@/app/components/DataTable/CourseContentDataTable/CourseContentDataTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/Tabs/Tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/Tooltip/Tooltip";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { LuGlobe, LuLock } from "react-icons/lu";

export default function CourseContentTeacherPage() {
  return (
    <div>
      <Tabs defaultValue="public">
        <div className="flex flex-row gap-3">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="public">
              <LuGlobe className="h-3 mr-2" /> Public
            </TabsTrigger>
            <TabsTrigger value="private">
              {" "}
              <LuLock className="h-3 mr-2" /> Private
            </TabsTrigger>
          </TabsList>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AiOutlineQuestionCircle className="w-4 h-4 fill-grey-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-96">
                <p className="text-grey-800">
                  Private content are things like answer keys you dont want
                  students to see.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <TabsContent value="public" className="w-full">
          <CourseContentDataTable contentType="public" />
        </TabsContent>
        <TabsContent value="private" className="w-full">
          <CourseContentDataTable contentType="private" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
