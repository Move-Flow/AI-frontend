"use client";

import { ThemeProvider } from "@mui/material";
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { baseGoerli, goerli, sepolia, bscTestnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// Assuming you have an RPC URL for the BSC Testnet
const bscTestnetRpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";

if (!process.env.INFURA_ID) {
  throw new Error("You need to provide WALLET_CONNECT_PROJECT_ID env variable");
}

// Ethereum Provider Setup
const { chains, publicClient } = configureChains(
  [goerli, bscTestnet],
  [
    infuraProvider({ apiKey: process.env.INFURA_ID }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === bscTestnet.id) {
          return { http: bscTestnetRpcUrl };
        }
        return null; // Return null for chains without a custom RPC URL
      },
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "MoveFlow Subscription",
  projectId: process.env.WALLET_CONNECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={rainbowDarkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default AppProvider;
