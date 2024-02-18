// JimmyCard.tsx
"use client";
import React from "react";

interface JimmyCardProps {
  subscriptionDetails: {
    sample: string;
    networkToken: string;
    sender: string;
    receiver: string;
    tokenAmountPerTime: string;
    interval: string;
  };
}

const JimmyCard: React.FC<JimmyCardProps> = ({ subscriptionDetails }) => {
  const {
    sample,
    networkToken,
    sender,
    receiver,
    tokenAmountPerTime,
    interval,
  } = subscriptionDetails;

  return (
    <div className="bg-[#464255] w-[323px] h-[216] py-[25px] px-[24px] rounded-lg shadow-lg bubble2">
      <div className="mx-auto flex  flex-col justify-center gap-y-2">
        <p className=" mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3] "> Subscription Sample：</span>{" "}
          <span className="text-white">{sample}</span>
        </p>

        <p className=" mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3] "> Select network and token：</span>{" "}
          <span className="text-white">{networkToken}</span>
        </p>

        <p className=" mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3] "> Sender:</span>{" "}
          <span className="text-white">{shortenAddress(sender)}</span>
        </p>

        <p className=" mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3] "> Receiver:</span>{" "}
          <span className="text-white">
            {shortenAddress(receiver)}
          </span>
        </p>
        <p className=" mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3] ">Amount per time:</span>{" "}
          <span className="text-white">{tokenAmountPerTime}</span>
        </p>
        <p className=" mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3] ">Interval:</span>{" "}
          <span className="text-white">{interval}</span>
        </p>
        <button className="bg-[#AB54DB]  text-white px-4 py-2 mt-4 rounded">
          Insufficient Balance
        </button>
      </div>
    </div>
  );
};

export default JimmyCard;

// Utility function to shorten the address
function shortenAddress(address: string) {
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
}
