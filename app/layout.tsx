"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import "@rainbow-me/rainbowkit/styles.css";
import AiChatInterface from "./components/AiChatInterface";
import Header from "./components/Header";
import AppProvider from "./provider";
import Box from "@mui/material/Box";
import { Inter } from "next/font/google";
import "./globals.css";
import Loading from "./page";

declare global {
  interface Window {
    ethereum: any;
  }
}

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const navigate = async () => {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        try {
          await router.push("/Generalbot");
        } catch (error) {
          console.error("Failed to navigate:", error);
        }
      }
      setIsLoading(false);
    };

    navigate();
  }, [router]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <main className="container">
          {/* Assume AppProvider, Header, Box, Loading are defined elsewhere */}
          <AppProvider>
            <Header />

            <Box>{isLoading ? <Loading /> : children}</Box>
          </AppProvider>
        </main>
      </body>
    </html>
  );
}
