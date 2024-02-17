import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Chatbot = {
  id: string;
  name: string;
  imgurl: string;

  time: string;
  unreadCount?: number;
};

export const chatbots: Chatbot[] = [
  {
    id: "Generalbot",
    name: "MoveFlow AI Team",
    imgurl: "https://move-flow.github.io/assets/move.png",
    time: "2min",
    unreadCount: 6,
  },
  {
    id: "bot1",
    name: "Sarah@Streaming AI",
    imgurl: "https://move-flow.github.io/assets/subscription.png",
    time: "2min",
    unreadCount: 6,
  },
  {
    id: "bot2",
    name: "Jimmy@Subscription AI",
    imgurl: "https://move-flow.github.io/assets/hr.png",
    time: "2min",
    unreadCount: 6,
  },
  {
    id: "bot3",
    name: "Sam@HR AI",
    imgurl: "https://move-flow.github.io/assets/finance.png",
    time: "2min",
    unreadCount: 6,
  },
];

function AibotInterface() {
  const [activeBotId, setActiveBotId] = useState<string>("Generalbot"); // Default to the first bot
  const router = useRouter();

  const handleBotClick = (id: string) => {
    setActiveBotId(id); // Update the active state
    router.push(`/${id}`); // Navigate programmatically
  };

  return (
    <div className="bg-[#24232C] w-[409px] rounded-[18px] h-[748px] overflow-y-auto">
      <ul>
        {chatbots.map((bot) => (
          <li key={bot.id} className="mb-4">
            <div
              className={`flex items-center p-2 rounded-lg transition duration-300 ease-in-out cursor-pointer ${
                activeBotId === bot.id ? "bg-[#292833]" : "hover:bg-[#292833]"
              }`}
              onClick={() => handleBotClick(bot.id)}
            >
              <div className="relative mx-4">
                <Image
                  src={bot.imgurl}
                  width={45}
                  height={45}
                  alt={bot.name}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {bot.name}
                </p>

                <p className="text-xs text-gray-400 truncate my-2">
                  new message
                </p>
              </div>
              <div className="mr-6 text-right mb-[31px] ">
                <p className="text-xs text-gray-500">{bot.time}</p>
                {/* {bot.unreadCount! > 0 && (
                  <span className=" bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {bot.unreadCount}
                  </span>
                )} */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AibotInterface;
