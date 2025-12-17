import { createPublicClient, http, formatGwei } from "viem";

const RPC_URL = process.env.RPC_URL || "https://eth.didlab.org";
const CHAIN_ID = Number(process.env.CHAIN_ID || "252501");
const TX_HASH = process.env.TX_HASH as `0x${string}`;

async function main() {
  const chain = {
    id: CHAIN_ID,
    name: "didlab",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  };
  
  const client = createPublicClient({ chain, transport: http(RPC_URL) });
  
  console.log("=== NETWORK STATUS ===");
  
  // Get latest block
  try {
    const block = await client.getBlock({ blockTag: 'latest' });
    console.log("Latest block:", block.number.toString());
    console.log("Block timestamp:", new Date(Number(block.timestamp) * 1000).toISOString());
    console.log("Base fee:", block.baseFeePerGas ? formatGwei(block.baseFeePerGas) + " gwei" : "N/A");
  } catch (e) {
    console.error("Error getting block:", e);
  }
  
  // Check if transaction exists
  if (TX_HASH) {
    console.log("\n=== TRANSACTION STATUS ===");
    console.log("TX Hash:", TX_HASH);
    
    try {
      const tx = await client.getTransaction({ hash: TX_HASH });
      console.log("✅ Transaction found in mempool/chain");
      console.log("From:", tx.from);
      console.log("To:", tx.to || "Contract Creation");
      console.log("Gas:", tx.gas?.toString());
      console.log("Gas Price:", tx.gasPrice ? formatGwei(tx.gasPrice) + " gwei" : "N/A");
      console.log("Nonce:", tx.nonce);
      
      // Try to get receipt
      try {
        const receipt = await client.getTransactionReceipt({ hash: TX_HASH });
        console.log("\n✅ TRANSACTION MINED!");
        console.log("Block:", receipt.blockNumber.toString());
        console.log("Status:", receipt.status);
        console.log("Contract Address:", receipt.contractAddress || "N/A");
      } catch {
        console.log("\n⏳ Transaction pending (not mined yet)");
      }
    } catch (e) {
      console.log("❌ Transaction not found");
      console.log("It may have been dropped or replaced");
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
