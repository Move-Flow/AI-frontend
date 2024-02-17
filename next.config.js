/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    INFURA_ID: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    WALLET_CONNECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    ETHEREUM_CONTRACT: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ID,
    MUMBAI_TESTNET_CONTRACT: process.env.NEXT_PUBLIC_MUMBAI_TESTNET_CONTRACT,
  },

  experimental: {
    esmExternals: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arthuremma2.github.io",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https", // Make sure to specify the protocol
        hostname: "move-flow.github.io", // Add this line to include move-flow.github.io
      },
    ],
  },
};

module.exports = nextConfig;
