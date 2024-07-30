import ChatLogo from "@/assets/ChatLogo";
import { IoDocumentOutline } from "react-icons/io5";
import { ThreeDots } from "react-loader-spinner";

import ChatContent from "../ChatContent/ChatContent";
import { Sheet, SheetContent, SheetTrigger } from "../Sheet/Sheet";

export type ChatReplyT = {
  result: string;
  sources: {
    name: string;
    url: string;
    page: number;
  }[];
};

type ReplyProps =
  | {
      chatReply: ChatReplyT;
      loading?: false;
    }
  | {
      chatReply?: never;
      loading: true;
    };

export default function Reply({ chatReply, loading = false }: ReplyProps) {
  return (
    <div className="flex flex-row gap-5 items-start justify-items-center">
      <div className="min-w-7">
        <ChatLogo className="h-7 w-7" />
      </div>
      <div className="flex flex-col">
        {loading ? (
          <ThreeDots
            visible={true}
            height="28"
            width="28"
            color="#344054"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <>
            <p className="font-medium">Parakeet</p>
            <div className="mt-2">
              <ChatContent content={chatReply?.result!} />
            </div>
          </>
        )}

        {chatReply && chatReply.sources.length > 0 && (
          <div className="flex flex-col mt-3">
            <p className="font-medium text-sm text-grey-700">Sources</p>
            <div className="flex flex-row gap-3 mt-2 w-full flex-wrap">
              {chatReply.sources.map((source, index) => (
                <Sheet key={index}>
                  <SheetTrigger className="bg-white border border-grey-300 rounded-xl py-2 px-3 w-fit max-w-[150px] flex flex-row gap-2 items-center pointer hover:cursor-pointer hover:border hover:border-blue-500 transition-all hover:bg-blue-50/50">
                    <div className="w-3 h-3 min-w-3">
                      <IoDocumentOutline className="w-3 h-3" />
                    </div>
                    <p className="text-xs truncate">{source.name}</p>
                  </SheetTrigger>
                  <SheetContent className="bg-white w-[50%] p-0">
                    <object
                      className="w-full h-[94%] my-12"
                      data={`${source.url}#page=${source.page}`}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    >
                      <a href={`${source.url}#page=${source.page}`}>Source</a>
                    </object>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
