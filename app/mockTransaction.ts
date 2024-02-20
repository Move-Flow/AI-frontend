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

    const endpoint = "https://moveflow-ai-api-backend.vercel.app/api/jimmy";
    const botImageUrl = activeBot.imgurl;
    const AIbotName = activeBot.name;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: input }),
      });

  //     if (response.ok) {
  //       const data = await response.json();
  //       // Check if the response is directly usable JSON (e.g., conversational response)
        if (
          typeof data === "object" &&
          data.hasOwnProperty("result") &&
          !data.result.startsWith("{")
        ) {
          console.log(data.result);
          // Handle conventional conversational response
          const newMessage = {
            id: Date.now(),
            text: data.result,
            sender: "ai",
            type: "ai",
            imgUrl: botImageUrl,
            name: AIbotName,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          // Attempt to parse the API response for transaction data
          const parsedResult = parseJimmyApiResponse(data.result);
          if (parsedResult) {
            const { message, data: jsonData } = parsedResult;
            const messageType = jsonData ? "transactionSummary" : "ai";
            const newMessage = {
              id: Date.now(),
              text: message || data.result, // Use message if available, otherwise default to data.result
              sender: "ai",
              type: messageType,
              imgUrl: botImageUrl,
              name: AIbotName,
              ...(jsonData && { JimmySubscriptionDetails: jsonData }),
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          } else {
            console.log("Failed to parse API response for Jimmy's bot.");
          }
        }
      } else {
        console.error(
          "Failed to fetch data from Jimmy's API:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching data from Jimmy's API:", error);
    }
  };


