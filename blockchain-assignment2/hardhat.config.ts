import type { HardhatUserConfig } from "hardhat/types";
import "dotenv/config";

//const RPC_URL = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID || "0");

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  network: {
    didlab: {
      url: process.env.RPC_URL || "http://127.0.0.1:8545",
      chainId: CHAIN_ID || 31337,
      //type: "http",
    },
  },
};

export default config;