// SarahCard.tsx
"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import arrow from "../../public/arrow.png";

type TransactionInfo = {
  transaction_name: string;
  token: string;
  start_time: string;
  number_of_time: number;
  end_time: string;
  receiver_wallet_address: string;
  time_interval: string;
  token_amount_per_time: number;
};

// Include only the transaction-related type and remove individual transaction-related properties
interface SarahCardProps {
  transactionInfo: TransactionInfo;
  id: number;
  enableStreamRate: boolean;
  numberOfTimes: number | undefined;
  amountPerTime: number | undefined;
  interval: number;
  handleSwitchChange: () => void;
  handleCancel: (id: number) => void;
  onConfirm: () => void;
  intervals: { value: number; label: string }[];
  setNumberOfTimes: React.Dispatch<React.SetStateAction<number | undefined>>;
  setAmountPerTime: React.Dispatch<React.SetStateAction<number | undefined>>;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
  generateOptions: (
    items: any[],
    valueField: string,
    labelField: string
  ) => JSX.Element[];
}

const SarahCard: React.FC<SarahCardProps> = ({
  transactionInfo,
  enableStreamRate,
  numberOfTimes,

  amountPerTime,
  id,
  interval,
  handleSwitchChange,
  handleCancel,
  onConfirm,
  intervals,
  setNumberOfTimes,
  setAmountPerTime,
  setInterval,
  generateOptions,
}) => {
  // Destructure transactionInfo for easier access
  const {
    transaction_name,
    token,
    time_interval,
    start_time,
    number_of_time,
    end_time,
    receiver_wallet_address,
    token_amount_per_time,
  } = transactionInfo;

  const [localIsTransactionLoading, setLocalIsTransactionLoading] =
    useState(false); // Local loading state

  const handleLocalTransaction = async () => {
    setLocalIsTransactionLoading(true);
    await onConfirm(); // Call the onConfirm function passed from the parent component
    setLocalIsTransactionLoading(false);
  };

  // Card JSX
  return (
    <div className="bg-[#464255]  w-[644px] h-[100%] rounded-[18px] p-5 bubble2 card-font my-4">
      <div className="flex justify-between mt-5 ">
        {/* Left column */}
        <div className="flex flex-col gap-y-3">
          <div className="text-base flex tracking-wider gap-x-2 text-[#A3A3A3] text-[13px]">
            <p className="text-[13px]">
              Transaction Name:{" "}
              <span className="text-white text-[13px]">{transaction_name}</span>
            </p>
          </div>
          <div className="text-base tracking-wider text-[#A3A3A3] text-[13px] flex gap-2">
            <p className="text-[13px]">Token: </p>
            <span className="text-white text-[13px]">{token}</span>
          </div>
          <div className="text-[#A3A3A3]  tracking-wider flex items-center">
            <p className="text-[13px]">Time:</p>
            <span className="text-white ml-2 flex items-center font-ibm text-[13px]">
              {start_time}
              {/* Inline SVG for arrow. Adjust as needed. */}
              <Image
                src={arrow}
                alt="Arrow"
                width={14}
                height={11}
                className="mx-2"
              />
              {end_time}
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-y-3 tracking-wider">
          <div className="text-[#A3A3A3] text-[13px]">
            Receiver Wallet Address:
            <span className="text-white ml-1">
              {""}
              {shortenAddress(receiver_wallet_address)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#A3A3A3] text-[13px]">Token Amount:</span>
            <span className="text-[#F143E2] text-[13px] font-bold">
              {token_amount_per_time}
            </span>
          </div>
        </div>
      </div>
      <Grid container spacing={3} sx={{ padding: 1 }}>
        <Grid item sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={enableStreamRate}
                onChange={handleSwitchChange}
                name="gilad"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#ffff", // Thumb color when checked
                    "&:hover": {
                      backgroundColor: "rgba(171, 84, 219, 0.08)", // Ripple color when hovered
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#F143E2", // Track color when checked
                  },
                }}
              />
            }
            label="Enable Stream Rate"
            sx={{
              "& .MuiTypography-body1": {
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "1.5px",
              },
            }}
          />
        </Grid>
      </Grid>
      {enableStreamRate && (
        <Grid container spacing={3} sx={{ padding: 1 }}>
          <Grid item sm={4}>
            <p className="text-[13px] tracking-wider">
              <span className="text-[#A3A3A3] font-ibm">No.of Time:</span>
              {number_of_time}
            </p>
          </Grid>
          <Grid item sm={4}>
            <p className="text-[13px] tracking-wider">
              <span className="text-[#A3A3A3]"> Token Amount:</span>{" "}
              {token_amount_per_time}
            </p>
          </Grid>
          <Grid item sm={4}>
            <p className="text-[13px] tracking-wider">
              <span className="text-[#A3A3A3]">Time interval:</span>{" "}
              {time_interval}
            </p>
          </Grid>
        </Grid>
      )}

      <div className="flex items-center justify-center mt-4 space-x-4">
        <button
          onClick={() => handleCancel(id)}
          className="bg-[#313138]  w-[99px] h-[32px] text-white text-xs p-2 rounded-lg hover:bg-[#4A4A4A]"
        >
          Cancel
        </button>
        <button
          onClick={handleLocalTransaction}
          className="bg-[#AB54DB] text-white text-xs p-2 w-[99px] h-[32px] rounded-lg hover:bg-[#9333EA] flex items-center justify-center"
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

function shortenAddress(address: string) {
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
}

export default SarahCard;
