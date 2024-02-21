// mockTransactions.ts or directly in your component file
// Define TransactionInfo type
export type TransactionInfo = {
  transaction_name: string;
  token: string;
  start_time: string;
  end_time: string;
  receiver_wallet_address: string;
  token_amount_per_time: number;
};

// Calculate the current time as the start time
const startTime = new Date();

// Calculate the end time, one month from now
const endTime = new Date(
  new Date(startTime).setMonth(startTime.getMonth() + 1)
);

// Format start and end times as ISO strings (YYYY-MM-DDTHH:MM:SSZ)
const formattedStartTime = startTime.toISOString();
const formattedEndTime = endTime.toISOString();

// Incorporate these dynamic times into your mock data
export const mockTransactions: TransactionInfo[] = [
  {
    transaction_name: "Mock Transaction 1",
    receiver_wallet_address: "0xD44B6Fcb1A698c8A56D9Ca5f62AEbB738BB09368",
    token: "ETH",
    start_time: formattedStartTime,
    end_time: formattedEndTime,
    token_amount_per_time: 0.01,
  },
  // Add more mock transactions if needed
];

// const sendMessageToBot = async (input: string) => {
//   // You can still determine which bot is active based on chatbotId if needed
//   const activeBot = chatbots.find((bot) => bot.id === chatbotId);
//   if (!activeBot) return;

//   // Simulate an API response delay
//   setTimeout(() => {
//     const mockData = mockTransactions.map((transaction, index) => ({
//       id: Date.now() + index, // Unique id for each message
//       text: "", // You might want to include some text here if needed
//       sender: "ai",
//       type: "transactionSummary",
//       transactionDetails: transaction,
//     }));

//     // Update your messages state with the mock data
//     setMessages((prevMessages) => [...prevMessages, ...mockData]);
//   }, 500); // Adjust delay as needed
// };

// const sendMessageToJimmyBot = async (input: string) => {
//   if (activeBot?.id !== "bot2") {
//     console.error("This function is intended for Jimmy's bot.");
//     return;
//   }

//   const endpoint = "https://moveflow-ai-api-backend.vercel.app/api/jimmy";
//   const botImageUrl = activeBot.imgurl;
//   const AIbotName = activeBot.name;

//   try {
//     const response = await fetch(endpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ msg: input }),
//     });

// //     if (response.ok) {
// //       const data = await response.json();
// //       // Check if the response is directly usable JSON (e.g., conversational response)
//       if (
//         typeof data === "object" &&
//         data.hasOwnProperty("result") &&
//         !data.result.startsWith("{")
//       ) {
//         console.log(data.result);
//         // Handle conventional conversational response
//         const newMessage = {
//           id: Date.now(),
//           text: data.result,
//           sender: "ai",
//           type: "ai",
//           imgUrl: botImageUrl,
//           name: AIbotName,
//         };
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       } else {
//         // Attempt to parse the API response for transaction data
//         const parsedResult = parseJimmyApiResponse(data.result);
//         if (parsedResult) {
//           const { message, data: jsonData } = parsedResult;
//           const messageType = jsonData ? "transactionSummary" : "ai";
//           const newMessage = {
//             id: Date.now(),
//             text: message || data.result, // Use message if available, otherwise default to data.result
//             sender: "ai",
//             type: messageType,
//             imgUrl: botImageUrl,
//             name: AIbotName,
//             ...(jsonData && { JimmySubscriptionDetails: jsonData }),
//           };
//           setMessages((prevMessages) => [...prevMessages, newMessage]);
//         } else {
//           console.log("Failed to parse API response for Jimmy's bot.");
//         }
//       }
//     } else {
//       console.error(
//         "Failed to fetch data from Jimmy's API:",
//         response.statusText
//       );
//     }
//   } catch (error) {
//     console.error("Error fetching data from Jimmy's API:", error);
//   }
// };

// const sendMessageToSarahBot = async (input: any) => {
//   // Ensure this function is specifically for Sarah bot only
//   if (activeBot?.id !== "bot1") {
//     console.error("This function is only for Sarah bot");
//     return;
//   }

//   const endpoint = "https://moveflow-ai-api-backend.vercel.app/api/sarah";
//   const botImageUrl = activeBot.imgurl; // Set bot's image URL for Sarah
//   const AIbotName = activeBot.name;

//   try {
//     const response = await fetch(endpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ msg: input }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       let apiResponse;

//       try {
//         apiResponse = JSON.parse(data.result);
//         // Assuming the response is a transaction detail object
//         const newMessage = {
//           id: Date.now(),
//           text: "",
//           sender: "ai",
//           type: "transactionSummary",
//           imgUrl: botImageUrl,
//           name: AIbotName,
//           transactionDetails: apiResponse,
//         };
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       } catch {
//         // Handle plain text response
//         const newMessage = {
//           id: Date.now(),
//           text: data.result,
//           sender: "ai",
//           type: "ai",
//           imgUrl: botImageUrl,
//         };
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     } else {
//       console.error("Failed to fetch data from Sarah's API");
//     }
//   } catch (error) {
//     console.error("Error fetching data from Sarah's API:", error);
//   }
// };

// const sendMessageToSarahBot = async (input: any) => {
//   // Mock response data
//   const mockResponse = {
//     result:
//       '{\n    "transaction_name": "monthly payment",\n    "receiver_wallet_address": "0xD44B6Fcb1A698c8A56D9Ca5f62AEbB738BB09368",\n    "remark": "0.2 BNB will be sent to Walter\'s wallet each month for the next 12 months",\n    "token": "BNB",\n    "enable_stream_rate": 1,\n    "amount": "10",\n    "start_time": "2024/2/23 00:00:00",\n    "end_time": "2024/12/31 23:59:59",\n    "number_of_time": 12,\n    "token_amount_per_time": 10,\n    "time_interval": "month"\n}',
//   };

//   try {
//     // Directly use the mock response instead of fetching from the endpoint
//     let apiResponse;

//     try {
//       apiResponse = JSON.parse(mockResponse.result);
//       // Assuming the response is a transaction detail object
//       const newMessage = {
//         id: Date.now(),
//         text: "",
//         sender: "ai",
//         type: "transactionSummary",
//         imgUrl: "https://move-flow.github.io/assets/subscription.png",
//         name: activeBot!.name,
//         transactionDetails: apiResponse,
//       };
//       setMessages((prevMessages) => [...prevMessages, newMessage as Message]);
//     } catch {
//       // Handle plain text response
//       const newMessage = {
//         id: Date.now(),
//         text: mockResponse.result,
//         sender: "ai",
//         type: "ai",
//         imgUrl: "https://move-flow.github.io/assets/subscription.png",
//       };

//       setMessages((prevMessages) => [...prevMessages, newMessage as Message]);
//     }
//   } catch (error) {
//     console.error("Error handling mock response from Sarah's bot:", error);
//   }
// };
