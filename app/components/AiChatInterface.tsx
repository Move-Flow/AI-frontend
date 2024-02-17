"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../chatStyle.module.css";
import Image from "next/image";
import { useChatbot } from "../context/ChatbotContext";
import Abi from "../contractABI/ABI.json";
import Approve from "../contractABI/approve.json";
import { ethers } from "ethers";

import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import send from "../../public/send.png";
import avatar from "../../public/avatar-g.png";
import arrow from "../../public/arrow.png";
import {
  Send,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  TextFields,
  FormatListBulleted,
  FormatListNumbered,
  Attachment,
  InsertEmoticon,
  MoreVert,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  type?: "user" | "ai" | "botName" | "transactionSummary";
  imgUrl?: string;
  transactionDetails?: TransactionDetails; // Additional property for the transaction details
}

interface Window {
  ethereum: any;
}

interface NormalMessage {
  text: string;
}

interface Option {
  addr: string;
  name: string;
  label: string;
}

const intervals = [
  {
    value: 1000,
    label: "second",
  },
  {
    value: 1000 * 60,
    label: "minute",
  },
  {
    value: 1000 * 60 * 60,
    label: "hour",
  },
  {
    value: 1000 * 60 * 60 * 24,
    label: "day",
  },
  {
    value: 1000 * 60 * 60 * 24 * 30,
    label: "month",
  },
];

const convertRateTypeToSeconds = (rateType: any) => {
  switch (rateType) {
    case "second":
      return 1; // 1 second
    case "minute":
      return 60; // 60 seconds
    case "hour":
      return 3600; // 3,600 seconds
    case "day":
      return 86400; // 86,400 seconds
    case "month":
      return 2592000; // Approx. 30 days in seconds
    case "year":
      return 31536000; // Approx. 365 days in seconds
    default:
      return 0; // Default or unknown interval
  }
};

// A new interface for the transaction details
interface TransactionDetails {
  stopTime: ReactNode;
  tokenAddress: ReactNode;
  transaction_name: string;
  receiver_wallet_address: string;
  remark: string;
  token: string;
  enable_stream_rate: number;
  start_time: string;
  end_time: string;
  number_of_time: number;
  token_amount_per_time: number;
  time_interval: string;
}
interface Props {
  chatbotId?: string; // Make it optional
}

const AiChatInterface: React.FC<Props> = ({ chatbotId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [numberOfTimes, setNumberOfTimes] = useState(undefined);
  const [amountPerTime, setAmountPerTime] = useState(undefined);
  const [interval, setInterval] = useState(1000);
  const [enableStreamRate, setEnableStreamRate] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const textareaRef = useRef(null);

  // Assuming you have an environment variable for the contract address and Ethereum node URL
  const contractAddress = "0x638f4e36Dd45ec543670a185334C0b8fa6eDd0a9";

  // Function to shorten the wallet address
  const shortenAddress = (address: string) => {
    const start = address.slice(0, 5); // Take the first 6 characters
    const end = address.slice(-4); // Take the last 4 characters
    return `${start}...${end}`; // Combine them with an ellipsis
  };

  const handleSwitchChange = () => {
    if (enableStreamRate) {
      setEnableStreamRate(false);
      setNumberOfTimes(undefined);
      setAmountPerTime(undefined);
    } else {
      setEnableStreamRate(true);
    }
  };

  const handleCancel = (id: number) => {
    // Remove the message with the specific id and its preceding prompt
    setMessages((prevMessages) =>
      prevMessages.filter(
        (message) => message.id !== id && message.id !== id - 1
      )
    );
  };

  const chatbots = [
    {
      id: "Generalbot",
      name: "MoveFlow AI Team",
      imgurl: "https://move-flow.github.io/assets/move.png",
      time: "2min",
      unreadCount: 6,
      description:
        "I'm the General bot, I can help you interact with the other bots.",
    },

    {
      id: "bot1",
      name: "Sarah",
      imgurl: "https://move-flow.github.io/assets/subscription.png",
      description:
        "I am Sarahm, an AI agent specializing for streaming payment.",
      time: "2min",
      unreadCount: 6,
    },
    {
      id: "bot2",
      name: "Jimmy",
      description:
        " I am Jimmy, an AI agent specializing for corporate financial management.",
      imgurl: "https://move-flow.github.io/assets/hr.png",
      time: "2min",
      unreadCount: 6,
    },
    {
      id: "bot3",
      name: "Sam",
      imgurl: "https://move-flow.github.io/assets/finance.png",
      description: " an AI agent specializing for HR management.",
      time: "2min",
      unreadCount: 6,
    },
  ];

  const activeBot = chatbots.find((bot) => bot.id === chatbotId);
  const totalBots = chatbots.length - 1;

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const generateOptions = (
    items: any,
    valueField: string,
    labelField: string
  ) => {
    return items.map((item: any) => {
      return (
        <MenuItem value={item[valueField]} key={item[valueField]}>
          {item[labelField]}
        </MenuItem>
      );
    });
  };

  const handleTextareaChange = (event: any) => {
    setInput(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit"; // Reset the height to get the correct scrollHeight
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        40
      )}px`; // Set the new height
    }
  };

  // Convert the deposit to 18 decimal places

  // Function to handle the conversion and transaction sending
  // Declare Ethereum instances outside the function
  const provider = new ethers.BrowserProvider(window.ethereum);
  let signer: any;
  let contract: ethers.Contract;

  // Function to initialize the signer and contract
  const initializeEthereum = async () => {
    if (!signer) {
      signer = await provider.getSigner();
    }
    if (!contract) {
      contract = new ethers.Contract(contractAddress, Abi, signer);
    }
  };

  // Function to handle the conversion and transaction sending
  const handleTransaction = async () => {
    setIsTransactionLoading(true);
    const message = messages.find((m) => m.type === "transactionSummary");
    if (!message || !message.transactionDetails) {
      console.error("Invalid transaction message.");
      return;
    }

    const { deposit, recipient, startTime, stopTime, interval } =
      message.transactionDetails;

    const startTimeStamp = Math.floor(new Date(startTime).getTime() / 1000);
    const stopTimeStamp = Math.floor(new Date(stopTime).getTime() / 1000);
    const intervalInSeconds = convertRateTypeToSeconds(interval);
    const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
    const depositAmount = ethers.parseUnits(deposit);

    // Function to approve tokens
    const approveTokens = async (
      tokenContract: ethers.Contract,
      deposit: bigint
    ) => {
      const approvalTx = await tokenContract.approve(contractAddress, deposit);
      await approvalTx.wait();
      console.log("Tokens approved");
    };

    console.log("stop time:", stopTimeStamp);
    console.log("deposit", depositAmount);
    console.log("end time", startTimeStamp);
    console.log("intervals", intervalInSeconds);

    try {
      await initializeEthereum();

      const coinAddress = "0xD44B6Fcb1A698c8A56D9Ca5f62AEbB738BB09368";
      const tokenContract = new ethers.Contract(coinAddress, Approve, signer);
      const Contract = new ethers.Contract(coinAddress, Abi, signer);
      const address = await signer.getAddress();
      console.log("User address:", address);
      const balance = await provider.getBalance(address);
      console.log("User balance:", ethers.formatEther(balance) + " ETH");

      // Convert balance to a comparable number format
      const balanceInEther = parseFloat(ethers.formatEther(balance));

      // Convert depositAmount back to a number for comparison
      const depositAmountInEther = parseFloat(
        ethers.formatEther(depositAmount)
      );

      // Check if the user has enough balance to cover the deposit amount
      if (balanceInEther < depositAmountInEther) {
        console.error("Insufficient balance for the transaction.");
        alert("You have insufficient balance to complete this transaction.");
        setIsTransactionLoading(false);
        return;
      }
      await approveTokens(tokenContract, depositAmount);

      const tx = await Contract.createStream(
        recipient,
        depositAmount,
        coinAddress,
        startTimeStamp,
        stopTimeStamp,
        intervalInSeconds,
        { gasLimit: 500000 }
      );

      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Stream created successfully");
      setIsTransactionLoading(false);
    } catch (error: any) {
      console.error("Transaction error:", error);
      if (error.code === 4001) {
        // User rejected the transaction
        console.log("User rejected the transaction.");
      }
      setIsTransactionLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      // Add the new user message to the chat
      const newUserMessage = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        type: "user",
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      // Send the user input to the bot's API and handle the response
      await sendMessageToBot(input);

      // Clear the input after sending a message
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
        textareaRef.current.style.height = "54px";
      }
    }
  };

  const sendMessageToBot = async (input: any) => {
    const activeBot = chatbots.find((bot) => bot.id === chatbotId);
    if (!activeBot) return;

    let endpoint;
    switch (activeBot.id) {
      case "bot1":
        endpoint = "https://moveflow-ai-api-backend.vercel.app/api/sarah";
        break;
      case "bot2":
        endpoint = "https://moveflow-ai-api-backend.vercel.app/api/jimmy";
        break;
      case "bot3":
        endpoint = "https://moveflow-ai-api-backend.vercel.app/api/sam";
        break;
      default:
        console.error("Invalid bot ID");
        return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: input }),
      });

      if (response.ok) {
        const data = await response.json();
        let apiResponse;

        try {
          apiResponse = JSON.parse(data.result);
          // Assuming the response is a transaction detail object
          const newMessage: Message = {
            id: Date.now(),
            text: "",
            sender: "ai",
            type: "transactionSummary",
            transactionDetails: apiResponse, // Directly assigning the parsed object
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch {
          // Handle plain text response
          const newMessage: Message = {
            id: Date.now(),
            text: data.result,
            sender: "ai",
            type: "ai",
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      } else {
        console.error("Failed to fetch data from the bot's API");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="w-full h-[748px] rounded-[18px] bg-[#24232C] pt-5 pb-10 px-[30px] flex flex-col">
      {activeBot && (
        <>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Image
                src={activeBot.imgurl}
                alt={activeBot.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="ml-3 text-center">
                <p className="text-white text-lg mt-1">{activeBot.name}</p>
                {activeBot?.id === "Generalbot" && (
                  <div className="text-[#A3A3A3] text-sm flex gap-2 mt-2 mb-2">
                    <Image src={avatar} width={20} height={20} alt="" />
                    {totalBots} members
                  </div>
                )}
              </div>
            </div>

            <div className="flex">
              <IconButton aria-label="notifications">
                <NotificationsOffIcon sx={{ color: "#A3A3A3" }} />
              </IconButton>
              <IconButton aria-label="search">
                <SearchIcon sx={{ color: "#A3A3A3" }} />
              </IconButton>

              <IconButton color="inherit" aria-label="account">
                <InfoOutlinedIcon sx={{ color: "#A3A3A3" }} />
              </IconButton>
              <IconButton aria-label="display more actions" edge="end">
                <MoreVert sx={{ color: "#A3A3A3" }} />
              </IconButton>
            </div>
          </div>

          <hr className="my-4" style={{ borderColor: "#3B3741" }} />
        </>
      )}

      <div
        ref={messageContainerRef}
        className={`${styles.messageContainer} flex-1 p-4 space-y-2`}
      >
        {messages.map((message) =>
          message.type === "transactionSummary" &&
          message.transactionDetails ? (
            <div key={message.id} className="flex justify-end">
              <div className="bg-[#464255] w-[644px] h-[100%] rounded-[18px] p-5 my-2 bubble2 card-font">
                <div className="flex justify-between mt-5 ">
                  {/* Left column */}
                  <div className="flex flex-col gap-y-3">
                    <div className="text-base flex tracking-wider gap-x-2 text-[#A3A3A3] text-[13px]">
                      <p className="text-[13px]">
                        Transaction Name:{" "}
                        <span className="text-white text-[13px]">
                          {message.transactionDetails.transaction_name}
                        </span>
                      </p>
                    </div>
                    <div className="text-base tracking-wider text-[#A3A3A3] text-[13px] flex gap-2">
                      <p className="text-[13px]">Token: </p>
                      <span className="text-white text-[13px]">
                        {message.transactionDetails.token}
                      </span>
                    </div>
                    <div className="text-[#A3A3A3]  tracking-wider flex items-center">
                      <p className="text-[13px]">Time:</p>
                      <span className="text-white ml-2 flex items-center text-[13px]">
                        {message.transactionDetails.start_time}
                        {/* Inline SVG for arrow. Adjust as needed. */}
                        <Image
                          src={arrow}
                          alt="Arrow"
                          width={14}
                          height={11}
                          className="mx-2"
                        />
                        {message.transactionDetails.end_time}
                      </span>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col gap-y-3 tracking-wider">
                    <div className="text-[#A3A3A3] text-[13px]">
                      Receiver Wallet Address:
                      <span className="text-white ml-1">
                        {""}
                        {shortenAddress(
                          message.transactionDetails.receiver_wallet_address
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#A3A3A3] text-[13px]">
                        Amount:
                      </span>
                      <span className="text-[#F143E2] text-[13px] font-bold">
                        {message.transactionDetails.token_amount_per_time}
                      </span>
                      <span className="text-[#A3A3A3] text-[13px]">
                        Max:{" "}
                        <span className="text-[#F143E2] text-[13px] font-bold">
                          {message.transactionDetails.token_amount_per_time}
                        </span>
                      </span>
                      <span className="text-[##A3A3A3] text-[13px] font-bold">
                        ${message.transactionDetails.tokenAddress}{" "}
                        {/* Assuming you have maxAmount in your details */}
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
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
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
                      <InputLabel
                        sx={{ color: "#A3A3A3", fontSize: "16px" }}
                        shrink
                      >
                        No.of Time
                      </InputLabel>
                      <input
                        type="text"
                        value={numberOfTimes}
                        onChange={(e: any) => setNumberOfTimes(e.target.value)}
                        style={{
                          backgroundColor: "#313138",
                          marginBottom: "0",
                          outline: "none",
                        }}
                        className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
                        placeholder="E.g. 4"
                      />
                    </Grid>
                    <Grid item sm={4}>
                      <InputLabel
                        sx={{ color: "#A3A3A3", fontSize: "16px" }}
                        shrink
                      >
                        Token Amount
                      </InputLabel>
                      <input
                        type="text"
                        value={amountPerTime}
                        onChange={(e: any) => setAmountPerTime(e.target.value)}
                        style={{
                          backgroundColor: "#313138",
                          marginBottom: "0",
                          outline: "none",
                        }}
                        className="w-full bg-blue-200 text-sm rounded mb-4 p-2 input-field"
                        placeholder="E.g. 4"
                      />
                    </Grid>
                    <Grid item sm={4}>
                      <InputLabel
                        sx={{ color: "#A3A3A3", fontSize: "16px" }}
                        shrink
                      >
                        Time interval
                      </InputLabel>
                      <Select
                        value={interval}
                        onChange={(e: any) => setInterval(e.target.value)}
                        sx={{
                          width: "100%",
                          backgroundColor: "#313138",
                          color: "white",
                          height: "35px",
                          fontSize: "0.875rem",
                          "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                            {
                              border: 0,
                            },
                          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: 0,
                            },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Removes the border by default
                          },
                        }}
                        disableUnderline
                        MenuProps={{
                          style: {
                            maxHeight: 400,
                          },
                        }}
                      >
                        {generateOptions(intervals, "value", "label")}
                      </Select>
                    </Grid>
                  </Grid>
                )}

                <div className="flex items-center justify-center mt-4 space-x-4">
                  <button
                    onClick={() => handleCancel(message.id)}
                    className="bg-[#313138]  w-[99px] h-[32px] text-white text-xs p-2 rounded-lg hover:bg-[#4A4A4A]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransaction}
                    className="bg-[#AB54DB] text-white text-xs p-2 w-[99px] h-[32px] rounded-lg hover:bg-[#9333EA] flex items-center justify-center"
                    disabled={isTransactionLoading}
                  >
                    {isTransactionLoading ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "ai" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "botName" ? (
                <span className="inline-block px-4 pt-3 text-center text-white text-[12px] tracking-wider mr-[28px]">
                  {message.text}
                </span>
              ) : (
                <div className="flex">
                  <span
                    className={`inline-block px-4 py-2 ${
                      message.sender === "ai"
                        ? "bg-[#464255] py-3 text-white bubble2"
                        : "bg-[#17161E] py-3 text-white bubble"
                    } `}
                  >
                    {message.text}
                  </span>
                  {message.imgUrl && (
                    <img
                      src={message.imgUrl}
                      alt="Chatbot"
                      className="ml-2 rounded-full w-[30px] h-[30px]"
                    />
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>

      <div className="flex flex-col my-4 relative rounded-[13px] border border-[#3B3741]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          className="w-full pl-4 my-5 bg-transparent text-white placeholder-gray-500 focus:outline-none rounded-l-[13px] resize-none overflow-hidden"
          placeholder="Write your message here..."
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          style={{
            minHeight: "10px", // Start with a minHeight of 54px
            paddingRight: "160px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSend}
          className="absolute inset-y-0 right-5 mt-2 bg-[#AB54DB] w-100 h-[40px] text-[12px] hover:opacity-[0.8] text-white py-2 px-4 rounded-[13px] flex items-center justify-center"
        >
          <Image src={send} alt="send" />
        </button>
      </div>
    </div>
  );
};

export default AiChatInterface;
