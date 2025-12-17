import { createPublicClient, http, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL || "https://eth.didlab.org";
const CHAIN_ID = Number(process.env.CHAIN_ID || "252501");
const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").startsWith("0x")
  ? process.env.PRIVATE_KEY!
  : `0x${process.env.PRIVATE_KEY}`;

const chain = {
  id: CHAIN_ID,
  name: "didlab",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};

const account = privateKeyToAccount(PRIVATE_KEY);
const client = createPublicClient({ chain, transport: http(RPC_URL) });

const balance = await client.getBalance({ address: account.address });
console.log("Address:", account.address);
console.log("Balance:", formatEther(balance), "ETH");

if (balance === 0n) {
  console.log("\n⚠️  WARNING: Zero balance! You need gas to deploy.");
  console.log("Get testnet ETH from a faucet or send some to this address.");
}
