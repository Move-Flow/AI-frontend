"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import styles from "../chatStyle.module.css";
import Image from "next/image";
import { useChatbot } from "../context/ChatbotContext";
import Abi from "../contractABI/ABI.json";
import Approve from "../contractABI/approve.json";
import subscriptionAbi from "../contractABI/subscriptionABI.json";
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
import SarahCard from "./sarahCard";
import JimmyCard from "./Jimmycard";
import { TransactionInfo, mockTransactions } from "../mockTransaction";
import Link from "next/link";

export interface JimmySubscriptionDetails {
  transaction_name: string;
  Network: string;
  Token: string;
  Sender: string;
  Receiver: string;
  start_time: string;
  end_time: string;
  time_interval: string;
  token_amount_per_time: number;
}
interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  type:
    | "user"
    | "ai"
    | "botName"
    | "transactionSummary"
    | "ai_fetching"
    | "transactionLink";
  imgUrl?: string;
  name?: string;
  transactionDetails?: TransactionDetails; // Existing transaction details
  JimmySubscriptionDetails?: JimmySubscriptionDetails;
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
export interface TransactionDetails {
  transaction_name: string;
  receiver_wallet_address: string;
  start_time: string;
  end_time: string;
  token: string;
  interval: string;
  token_amount_per_time: number;
}
interface Props {
  chatbotId?: string; // Make it optional
}

const AiChatInterface: React.FC<Props> = ({ chatbotId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [numberOfTimes, setNumberOfTimes] = useState<number | undefined>(
    undefined
  );
  const [amountPerTime, setAmountPerTime] = useState<number | undefined>(
    undefined
  );

  const [interval, setInterval] = useState(1000);
  const [enableStreamRate, setEnableStreamRate] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const textareaRef = useRef(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [fetchError, setFetchError] = useState("");
  // Assuming you have an environment variable for the contract address and Ethereum node URL
  const contractAddress = "0x638f4e36Dd45ec543670a185334C0b8fa6eDd0a9";
  const SubscriptionContractAddress =
    "0x4027c067473066FE9D9588290554c16e016f34A7";

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
  };

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

  const handleTransaction = async (messageId: number) => {
    setIsTransactionLoading(true);
    console.log(`Processing transaction for message ID: ${messageId}`); // Log for debugging
    const message = messages.find((m) => m.id === messageId);

    if (!message || !message.transactionDetails) {
      console.error("Invalid transaction message for ID:", messageId);
      setIsTransactionLoading(false);
      return;
    }
    const {
      token_amount_per_time,
      receiver_wallet_address,
      start_time,
      end_time,
    } = message.transactionDetails;

    const startTimeStamp = Math.floor(new Date(start_time).getTime() / 1000);
    const stopTimeStamp = Math.floor(new Date(end_time).getTime() / 1000);
    const intervalInSeconds = convertRateTypeToSeconds(interval);
    const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
    const depositAmount = ethers.parseUnits(token_amount_per_time.toString());

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
      const Contract = new ethers.Contract(contractAddress, Abi, signer);
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
        receiver_wallet_address,
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

      const transactionHash = tx.hash;
      const bscScanUrl = `https://testnet.bscscan.com/tx/${transactionHash}`;

      // Create a special message type for transaction links
      const transactionLinkMessage: Message = {
        id: Date.now(),
        text: "Stream created successfully!", // Store the URL directly in the text or create a new property
        sender: "ai",
        type: "transactionLink", // Custom type for transaction links
      };

      // Add the transaction link message to your messages state
      setMessages((prevMessages) => [...prevMessages, transactionLinkMessage]);
    } catch (error: any) {
      console.error("Transaction error:", error);
      if (error.code === 4001) {
        // User rejected the transaction
        console.log("User rejected the transaction.");
      }
      setIsTransactionLoading(false);
    }
  };

  const handleSubscription = async (messageId: number) => {
    setIsTransactionLoading(true);
    console.log(`Processing transaction for message ID: ${messageId}`); // Log for debugging
    const message = messages.find((m) => m.id === messageId);

    if (!message || !message.JimmySubscriptionDetails) {
      console.error("Invalid transaction message for ID:", messageId);
      setIsTransactionLoading(false);
      return;
    }
    if (!message.JimmySubscriptionDetails) {
      console.error("JimmySubscriptionDetails is undefined.");
      return;
    }

    // Now TypeScript knows JimmySubscriptionDetails is not undefined
    const {
      start_time,
      end_time,
      time_interval,
      Receiver: receiverWithBrackets,
      token_amount_per_time,
    } = message.JimmySubscriptionDetails;

    // Extract just the wallet address from the Receiver string
    const receiverAddressMatch =
      receiverWithBrackets.match(/0x[a-fA-F0-9]{40}/);
    if (!receiverAddressMatch) {
      console.error("Invalid Receiver wallet address.");
      setIsTransactionLoading(false);
      return;
    }
    const Receiver = receiverAddressMatch[0]; // Use the first match as the receiver address
    console.log("Receiver address:", Receiver);
    const startTimeStamp = Math.floor(new Date(start_time).getTime() / 1000);
    const stopTimeStamp = Math.floor(new Date(end_time).getTime() / 1000);
    const intervalInSeconds = convertRateTypeToSeconds(time_interval);
    const depositAmount = ethers.parseUnits(token_amount_per_time.toString());

    // Function to approve tokens
    const approveTokens = async (
      tokenContract: ethers.Contract,
      deposit: bigint
    ) => {
      const approvalTx = await tokenContract.approve(
        SubscriptionContractAddress,
        deposit
      );
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
      const Contract = new ethers.Contract(
        SubscriptionContractAddress,
        Abi,
        signer
      );
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
        Receiver,
        depositAmount,
        coinAddress,
        startTimeStamp,
        stopTimeStamp,
        intervalInSeconds,
        { gasLimit: 500000 }
      );

      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Subscription created successfully");
      setIsTransactionLoading(false);

      const transactionHash = tx.hash;
      // const bscScanUrl = `https://testnet.bscscan.com/tx/${transactionHash}`;

      // Create a special message type for transaction links
      const transactionLinkMessage: Message = {
        id: Date.now(),
        text: "Subscription created successfully!", // Store the URL directly in the text or create a new property
        sender: "ai",
        type: "transactionLink", // Custom type for transaction links
      };

      // Add the transaction link message to your messages state
      setMessages((prevMessages) => [...prevMessages, transactionLinkMessage]);
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
      setIsFetchingData(true); // Set fetching data state to true when sending message
      setFetchError("");
      // Add the new user message to the chat
      const newUserMessage = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        type: "user",
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      // Clear the input
      setInput(""); // Set input to an empty string
      // Send the user input to the bot's API and handle the response
      // Check which bot is active and send the message to the appropriate bot
      if (activeBot?.id === "bot1") {
        await sendMessageToSarahBot(input); // For Sarah's bot
      } else if (activeBot?.id === "bot2") {
        await sendMessageToJimmyBot(input); // For Jimmy's bot
        // You can add else if clauses here for other bots as needed
      }

      setIsFetchingData(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
        textareaRef.current.style.height = "34px";
      }
    }
  };

  const parseJimmyApiResponse = (
    apiResponse: string
  ): { message: string; data?: any } | null => {
    try {
      // First, try to directly parse the entire response, assuming it's JSON
      const data = JSON.parse(apiResponse);
      return { message: "", data };
    } catch {
      // If direct parsing fails, look for embedded JSON
      const jsonRegex = /{.*}/s;
      const match = apiResponse.match(jsonRegex);
      if (match) {
        const jsonString = match[0];
        try {
          const data = JSON.parse(jsonString);
          const message = apiResponse.replace(jsonString, "").trim();
          return { message, data };
        } catch (error) {
          console.error(
            "Error parsing embedded JSON from Jimmy's API response:",
            error
          );
        }
      }
    }

    // If no JSON found or parsing failed, return the original response as the message
    console.error("No JSON found in Jimmy's API response");
    return { message: apiResponse };
  };

  const sendMessageToJimmyBot = async (input: string) => {
    if (activeBot?.id !== "bot2") {
      console.error("This function is intended for Jimmy's bot.");
      return;
    }

    const endpoint = "https://moveflow-ai-api-backend.vercel.app/api/jimmy";
    const botImageUrl = activeBot.imgurl;
    const AIbotName = activeBot.name;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      const parsedResult = parseJimmyApiResponse(data.result);
      console.log("Parsed API response:", parsedResult);

      if (!parsedResult) {
        console.log("Failed to parse API response for Jimmy's bot.");
        return;
      }

      const { message, data: jsonData } = parsedResult;
      const messageType = jsonData ? "transactionSummary" : "ai";
      const newMessage = {
        id: Date.now(),
        text: message || "Received a response from Jimmy's bot.",
        sender: "ai",
        type: messageType,
        imgUrl: botImageUrl,
        name: AIbotName,
        ...(jsonData && { JimmySubscriptionDetails: jsonData }),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Error fetching data from Jimmy's bot:", error);
    }
  };

  const sendMessageToSarahBot = async (input: any) => {
    // Ensure this function is specifically for Sarah bot only
    if (activeBot?.id !== "bot1") {
      console.error("This function is only for Sarah bot");
      return;
    }

    const endpoint = "https://moveflow-ai-api-backend.vercel.app/api/sarah";
    const botImageUrl = activeBot.imgurl; // Set bot's image URL for Sarah
    const AIbotName = activeBot.name;

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
          const newMessage = {
            id: Date.now(),
            text: "",
            sender: "ai",
            type: "transactionSummary",
            imgUrl: botImageUrl,
            name: AIbotName,
            transactionDetails: apiResponse,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch {
          // Handle plain text response
          const newMessage = {
            id: Date.now(),
            text: data.result,
            sender: "ai",
            type: "ai",
            imgUrl: botImageUrl,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      } else {
        console.error("Failed to fetch data from Sarah's API");
      }
    } catch (error) {
      console.error("Error fetching data from Sarah's API:", error);
    }
  };

  return (
    <div className="w-full lg:h-[670px] xl:h-[90vh] 2xl:h-[750px] rounded-[18px] bg-[#24232C] pt-5 pb-10 px-[30px]  flex flex-col">
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

            {isFetchingData && (
              <div className="mt-4">
                <CircularProgress
                  color="secondary"
                  size={22}
                  sx={{ marginTop: "3px" }}
                />
                <span className=" tracking-wider mx-2 mb-2">
                  AI is diligently working on your request...
                </span>
              </div>
            )}
            {fetchError && (
              <div className="fetch-error-message">{fetchError}</div>
            )}

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
        {messages.map((message) => {
          if (message.type === "transactionSummary") {
            // Render 'transactionSummary' message type
            return (
              <div className="flex flex-col justify-end my-4" key={message.id}>
                {/* Render the transaction summary text as an AI response */}
                <div className="flex flex-col justify-end items-end">
                  <span className="text-[#A3A3A3] text-sm mr-11 capitalize">
                    {message.name}
                  </span>
                  <div className="flex justify-end">
                    <span className="inline-block px-4 py-2 bg-[#464255] my-3 text-white bubble2">
                      {message.text}
                    </span>
                    <img
                      src={message.imgUrl}
                      alt="Chatbot"
                      className="ml-2 rounded-full w-[30px] h-[30px]"
                    />
                  </div>
                </div>

                {/* Check which bot's transaction details to render */}
                {activeBot?.id === "bot2" &&
                  message.JimmySubscriptionDetails && (
                    <div className="flex justify-end">
                      <JimmyCard
                        onConfirm={() => handleSubscription(message.id)}
                        subscriptionDetails={message.JimmySubscriptionDetails}
                      />
                    </div>
                  )}
                {activeBot?.id === "bot1" && message.transactionDetails && (
                  <div className="flex justify-end">
                    <SarahCard
                      id={message.id}
                      key={message.id}
                      transactionInfo={{
                        transaction_name:
                          message.transactionDetails.transaction_name,
                        start_time: message.transactionDetails.start_time,
                        end_time: message.transactionDetails.end_time,
                        token: message.transactionDetails.token,
                        receiver_wallet_address:
                          message.transactionDetails.receiver_wallet_address,
                        token_amount_per_time:
                          message.transactionDetails.token_amount_per_time,
                      }}
                      enableStreamRate={enableStreamRate}
                      numberOfTimes={numberOfTimes}
                      amountPerTime={amountPerTime}
                      interval={interval}
                      handleSwitchChange={handleSwitchChange}
                      handleCancel={handleCancel}
                      onConfirm={() => handleTransaction(message.id)}
                      intervals={intervals}
                      setNumberOfTimes={setNumberOfTimes}
                      setAmountPerTime={setAmountPerTime}
                      setInterval={setInterval}
                      generateOptions={generateOptions}
                    />
                  </div>
                )}
              </div>
            );
          }
          return (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "ai" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col items-end">
                {/* Render the AI bot's name if available */}
                {message.name && (
                  <p className="text-[#A3A3A3] text-sm mr-11 ">
                    {message.name}
                  </p>
                )}
                <div className="flex">
                  <span
                    className={`inline-block px-4 py-2 ${
                      message.sender === "ai"
                        ? "bg-[#464255] py-3 my-3 text-white bubble2"
                        : "bg-[#17161E] py-3 my-3 text-white bubble"
                    }`}
                  >
                    {message.text}
                  </span>
                  {/* Render the AI bot's image if available */}
                  {message.imgUrl && (
                    <img
                      src={message.imgUrl}
                      alt="Chatbot"
                      className="ml-2 rounded-full w-[30px] h-[30px]"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col my-4 relative rounded-[13px] border border-[#3B3741]">
        <textarea
          value={input}
          onChange={handleTextareaChange}
          className="w-full pl-4 h-[60px] py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none rounded-l-[13px] resize-none overflow-hidden"
          placeholder="Write your message here..."
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          style={{
            paddingRight: "130px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSend}
          className="absolute inset-y-0 right-5 my-3 bg-[#AB54DB] w-100 h-[40px] text-[12px] hover:opacity-[0.8] text-white py-2 px-4 rounded-[13px] flex items-center justify-center"
        >
          <Image src={send} alt="send" />
        </button>
      </div>
    </div>
  );
};

export default AiChatInterface;
