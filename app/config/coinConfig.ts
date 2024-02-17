const mainnetCoinConfig = {
  USDC: {
    coinType: "0x753F5A6785CcA3f8636D3e2E084094B0C6B9C476",
    unit: 10 ** 6,
  },
};

const testnetCoinConfig = {
  USDC: {
    coinType: "0x753F5A6785CcA3f8636D3e2E084094B0C6B9C476",
    unit: 10 ** 6,
  },
};

const getNetworkCoinConfig = (network: string) => {
  switch (network.toLowerCase()) {
    case "mainnet":
      return mainnetCoinConfig;
    case "testnet":
      return testnetCoinConfig;
    default:
      throw testnetCoinConfig;
  }
};

export default getNetworkCoinConfig;
