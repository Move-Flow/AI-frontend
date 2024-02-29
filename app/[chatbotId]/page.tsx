"use client";

import AiChatInterface from "@/app/components/AiChatInterface";
import AibotInterface from "../components/AibotInterface";
import { Metadata } from "next/types";
const metadata: Metadata = {
  title: "MoveFlow | AI",
  description: "",
};
export default function Page({ params }: { params: { chatbotId: string } }) {
  const id = params.chatbotId;
  return (
    <div>
      <div className="flex gap-8 items-center mt-7">
        <AibotInterface />
        <AiChatInterface chatbotId={id} metadata={metadata} />
      </div>
    </div>
  );
}
