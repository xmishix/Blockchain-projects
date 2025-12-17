import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseGwei } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID!);
const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").startsWith("0x")
  ? process.env.PRIVATE_KEY!
  : `0x${process.env.PRIVATE_KEY}`;

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY) 
    throw new Error("Missing RPC_URL/CHAIN_ID/PRIVATE_KEY");

  const { abi, bytecode } = await artifacts.readArtifact("BadgeNFT");

  const chain = {
    id: CHAIN_ID,
    name: "didlab",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  };

  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

  console.log("Deploying from address:", account.address);
  
  const gasPrice = parseGwei("10");
  const gas = 2_000_000n;

  const hash = await wallet.deployContract({
    abi, bytecode, args: [account.address], gasPrice, gas
  });
  console.log("Deploy tx:", hash);

  const rcpt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("\n🎉 BadgeNFT deployed at:", rcpt.contractAddress);
  console.log("\nSave this address! Run:");
  console.log(`export BADGE_ADDR=${rcpt.contractAddress}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
