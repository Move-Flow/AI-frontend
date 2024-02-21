import CircularProgress from "@mui/material/CircularProgress";
import {
  TransactionDetails,
  JimmySubscriptionDetails,
} from "./AiChatInterface";
import React, { useState } from "react";
import { Token } from "@mui/icons-material";

interface JimmyCardProps {
  subscriptionDetails: JimmySubscriptionDetails;
  onConfirm: () => void;
}

const JimmyCard: React.FC<JimmyCardProps> = ({
  subscriptionDetails,
  onConfirm,
}) => {
  const {
    transaction_name,
    Network,
    Sender,
    Token,
    Receiver,
    time_interval,
    end_time,
    start_time,
    token_amount_per_time,
  } = subscriptionDetails;

  const [localIsTransactionLoading, setLocalIsTransactionLoading] =
    useState(false); // Local loading state

  const handleLocalTransaction = async () => {
    setLocalIsTransactionLoading(true);
    await onConfirm(); // Call the onConfirm function passed from the parent component
    setLocalIsTransactionLoading(false);
  };

  return (
    <div className="bg-[#464255] w-[500px] h-[216] py-[25px] px-[24px] rounded-lg shadow-lg bubble2">
      <div className="mx-auto flex  flex-col justify-center gap-y-2">
        <p className="mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3]">Subscription Sample：</span>{" "}
          <span className="text-white">{transaction_name}</span>
        </p>
        <p className="mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3]">Select network and token：</span>{" "}
          <span className="text-white">
            {Network} {token_amount_per_time} {Token}
          </span>
        </p>
        <p className="mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3]">Sender:</span>{" "}
          <span className="text-white">{Sender}</span>
        </p>
        <p className="mb-1 card-font tracking-wider text-[13px] flex">
          <span className="text-[#A3A3A3] ">Receiver:</span>{" "}
          <span className="text-white flex-nowrap text-nowrap mx-1">
            {Receiver}
          </span>
        </p>

        <p className="mb-1 card-font tracking-wider text-[13px]">
          <span className="text-[#A3A3A3]">Interval:</span>{" "}
          <span className="text-white">{time_interval}</span>
        </p>
        <button
          onClick={handleLocalTransaction}
          className="bg-[#AB54DB]  text-white px-4 py-2 mt-4 rounded"
          disabled={localIsTransactionLoading}
        >
          {localIsTransactionLoading ? (
            <CircularProgress size={20} style={{ color: "white" }} />
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );
};

export default JimmyCard;

// Utility function to shorten the address
function shortenAddress(address: string) {
  // Ensure address is a string and not undefined or null
  if (typeof address === "string" && address.length >= 10) {
    // Check that address is a string and has a minimum length
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  } else {
    // Return a default value or indicate invalid/missing address
    return "Invalid address";
  }
}
