import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// -------------------- ENV VARS --------------------
const RPC_URL = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID!);
const PRIVATE_KEY_RAW = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");

const NAME = process.env.TOKEN_NAME;
const SYMBOL = process.env.TOKEN_SYMBOL;
const CAP_HUMAN = process.env.TOKEN_CAP;
const INIT_HUMAN = process.env.TOKEN_INITIAL;

// -------------------- MAIN SCRIPT --------------------
async function main() {
    if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY_RAW) throw new Error("Missing env RPC_URL/CHAIN_ID/PRIVATE_KEY");

    // Load ABI + bytecode compiled by Hardhat
    const { abi, bytecode } = await artifacts.readArtifact("TokenCredit");

    // Viem chain object
    const chain = {
        id: CHAIN_ID,
        name: `didlab-${CHAIN_ID}`,
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: [RPC_URL] } },
    };

    const account = privateKeyToAccount(`0x${PRIVATE_KEY_RAW}`);
    const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
    const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

    // Token parameters
    const cap = parseUnits(CAP_HUMAN, 18);
    const initialMint = parseUnits(INIT_HUMAN, 18);

    // Deploy contract
    console.log("Deploying TokenCredit...");
    const hash = await wallet.deployContract({
        abi,
        bytecode,
        args: [NAME, SYMBOL, cap, account.address, initialMint],
    });
    console.log("Deploy tx:", hash);

    // Wait for deployment receipt
    const rcpt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Deployed at:", rcpt.contractAddress);
    console.log("Block:", rcpt.blockNumber);

    // Save for later scripts
    console.log(`\nAdd this to .env:\nTOKEN_ADDRESS=${rcpt.contractAddress}\n`);
    console.log("Deployer:", account.address);
}

// -------------------- RUN SCRIPT --------------------
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
