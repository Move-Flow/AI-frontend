"use client";
import React, { createContext, useContext, useState } from "react";

type ChatbotContextType = {
  chatbotId: string;
  setChatbotId: (id: string) => void;
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatbotId, setChatbotId] = useState<string>("");

  return (
    <ChatbotContext.Provider value={{ chatbotId, setChatbotId }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
