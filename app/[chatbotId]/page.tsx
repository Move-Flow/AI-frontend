"use client";

import AiChatInterface from "@/app/components/AiChatInterface";
import AibotInterface from "../components/AibotInterface";

export default function Page({ params }: { params: { chatbotId: string } }) {
  const id = params.chatbotId;
  return (
    <div>
      <div className="flex gap-8 items-center mt-7">
        <AibotInterface />
        <AiChatInterface chatbotId={id} />
      </div>
    </div>
  );
}
