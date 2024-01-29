import { ChatResponse } from "../lib/model";
import parse from "html-react-parser";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { SpinnerSize, Spinner } from "./spinner";
import Image from "next/image";

interface ConversationProps {
  chats: ChatResponse[];
  showSpinner: boolean;
  imageURL: string;
}

export default function Conversation({
  chats,
  showSpinner,
  imageURL,
}: ConversationProps) {
  if (chats.length === 0 && imageURL === "") {
    return (
      <div className="grid w-full h-full place-items-center">
        <h1 className="text-3xl text-slate-500 font-thin">
          Welcome to Snowgoose
        </h1>
      </div>
    );
  } else if (imageURL !== "") {
    return (
      <div>
        <img src={imageURL} width={1028} height={1028} alt="Dall-e-3 image" />
      </div>
    );
  } else {
    return (
      <div>
        <div className="prose lg:w-[65ch]">
          {chats && chats.length > 0 ? (
            chats.map((chat: ChatResponse, index) => (
              <div
                key={index}
                className={
                  chat.role === "user"
                    ? "px-6 py-2 text-sm text-slate-600 italic bg-slate-100 rounded-md border-b-2"
                    : "p-2"
                }
              >
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {DOMPurify.sanitize(chat.content)}
                </Markdown>
              </div>
              //<div className="prose prose-slate">{parse(chat.content)}</div>
            ))
          ) : (
            <p>&nbsp;</p>
          )}
        </div>
        {showSpinner === true && <Spinner spinnerSize={SpinnerSize.md} />}
      </div>
    );
  }
}
