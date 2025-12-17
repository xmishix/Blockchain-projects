import { createPublicClient, http } from "viem";

const RPC_URL = process.env.RPC_URL || "https://eth.didlab.org";
const CHAIN_ID = Number(process.env.CHAIN_ID || "252501");

async function main() {
  const chain = {
    id: CHAIN_ID,
    name: "didlab",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  };
  
  const client = createPublicClient({ chain, transport: http(RPC_URL) });
  
  console.log("Watching for new blocks... (Ctrl+C to stop)\n");
  
  let lastBlock = 0n;
  
  for (let i = 0; i < 10; i++) {
    const block = await client.getBlock({ blockTag: 'latest' });
    const timestamp = new Date(Number(block.timestamp) * 1000);
    
    if (block.number !== lastBlock) {
      console.log(`Block ${block.number} | ${timestamp.toISOString()} | ${block.transactions.length} txs`);
      lastBlock = block.number;
    } else {
      console.log(`[${new Date().toISOString()}] Still at block ${block.number} (no new blocks)`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
