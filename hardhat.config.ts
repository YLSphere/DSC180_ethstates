import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import "./tasks/faucet";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Adjust the number of runs as needed
      },
    },
  },
  defaultNetwork: "localhost",
  networks: {
    polygon: {
      url: process.env.ALCHEMY_POLYGON_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
    polygonMumbai: {
      url: process.env.ALCHEMY_MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_KEY,
  },
};

export default config;
