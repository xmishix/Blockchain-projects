// scripts/mint.ts (plain viem, legacy gas)
import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseGwei } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL || "https://eth.didlab.org";
const CHAIN_ID = Number(process.env.CHAIN_ID || "252501");
const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").startsWith("0x")
  ? process.env.PRIVATE_KEY!
  : `0x${process.env.PRIVATE_KEY}`;
const BADGE_ADDR = process.env.BADGE_ADDR!;
const TOKEN_URI = process.env.TOKEN_URI!;

async function main() {
  if (!PRIVATE_KEY || !BADGE_ADDR || !TOKEN_URI) throw new Error("Missing PRIVATE_KEY/BADGE_ADDR/TOKEN_URI");

  const { abi } = await artifacts.readArtifact("BadgeNFT");
  const chain = { id: CHAIN_ID, name: "didlab", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: [RPC_URL] } } };

  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

  const gasPrice = parseGwei("10");

  const before = await publicClient.readContract({ address: BADGE_ADDR as `0x${string}`, abi, functionName: "nextId", args: [] }) as bigint;
  console.log("nextId before:", before.toString());

  const hash = await wallet.writeContract({
    address: BADGE_ADDR as `0x${string}`,
    abi,
    functionName: "mintTo",
    args: [account.address, TOKEN_URI],
    gasPrice,
  });
  console.log("Mint tx:", hash);

  const rcpt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Mined in block:", rcpt.blockNumber);

  const after = await publicClient.readContract({ address: BADGE_ADDR as `0x${string}`, abi, functionName: "nextId", args: [] }) as bigint;
  console.log("nextId after:", after.toString());
  console.log("Minted tokenId:", (after - 1n).toString());
}
main().catch((e) => { console.error(e); process.exit(1); });