import { defineConfig } from "hardhat/config";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL ?? "https://eth.didlab.org";
const CHAIN_ID = Number(process.env.CHAIN_ID ?? "252501");

export default defineConfig({
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "paris", // DIDLab is pre-PUSH0
    },
  },
  
  networks: {
    didlab: {
      url: process.env.DIDLAB_RPC_URL || "https://eth.didlab.org",
      chainId: 252501,
      accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : [],
      type: 'http',
    },
  },
});

