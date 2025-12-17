import { createWalletClient, createPublicClient, http, parseGwei, formatGwei } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL || "https://eth.didlab.org";
const CHAIN_ID = Number(process.env.CHAIN_ID || "252501");
const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").startsWith("0x")
  ? process.env.PRIVATE_KEY!
  : `0x${process.env.PRIVATE_KEY}`;

async function main() {
  const chain = {
    id: CHAIN_ID,
    name: "didlab",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  };

  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

  console.log("Address:", account.address);
  
  // Get current nonce status
  const minedNonce = await publicClient.getTransactionCount({ 
    address: account.address,
    blockTag: 'latest'
  });
  const pendingNonce = await publicClient.getTransactionCount({ 
    address: account.address,
    blockTag: 'pending'
  });
  
  console.log("\n=== NONCE STATUS ===");
  console.log("Latest mined nonce:", minedNonce);
  console.log("Pending nonce:", pendingNonce);
  console.log("Stuck transactions:", pendingNonce - minedNonce);
  
  if (pendingNonce === minedNonce) {
    console.log("\n✅ No pending transactions! You're clear.");
    return;
  }
  
  // Get network gas price
  const block = await publicClient.getBlock({ blockTag: 'latest' });
  const baseFee = block.baseFeePerGas || 0n;
  console.log("\nNetwork base fee:", formatGwei(baseFee), "gwei");
  
  // Use very high gas price to ensure it goes through
  const highGasPrice = parseGwei("100"); // 100 gwei - very high
  
  console.log("\n=== CLEARING PENDING TRANSACTIONS ===");
  console.log("Strategy: Send 0 ETH to self with high gas price for each stuck nonce");
  console.log("Gas price:", formatGwei(highGasPrice), "gwei");
  
  // Cancel each pending transaction by replacing with 0 ETH transfer to self
  const cancelTxs = [];
  for (let nonce = minedNonce; nonce < pendingNonce; nonce++) {
    console.log(`\nCancelling nonce ${nonce}...`);
    
    try {
      const hash = await wallet.sendTransaction({
        to: account.address, // Send to yourself
        value: 0n, // 0 ETH
        gasPrice: highGasPrice,
        gas: 21000n, // Minimum gas for transfer
        nonce: nonce
      });
      
      console.log(`✓ Cancellation tx sent: ${hash}`);
      cancelTxs.push({ nonce, hash });
    } catch (error) {
      console.error(`✗ Failed to cancel nonce ${nonce}:`, error);
    }
  }
  
  if (cancelTxs.length === 0) {
    console.log("\n❌ Failed to send any cancellation transactions");
    return;
  }
  
  console.log("\n⏳ Waiting for cancellations to be mined...");
  
  // Wait for all cancellation transactions
  for (const { nonce, hash } of cancelTxs) {
    try {
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: hash as `0x${string}`,
        timeout: 60_000
      });
      console.log(`✓ Nonce ${nonce} cleared in block ${receipt.blockNumber}`);
    } catch (error) {
      console.error(`✗ Nonce ${nonce} timeout - may still be pending`);
    }
  }
  
  // Verify all cleared
  const newPendingNonce = await publicClient.getTransactionCount({ 
    address: account.address,
    blockTag: 'pending'
  });
  const newMinedNonce = await publicClient.getTransactionCount({ 
    address: account.address,
    blockTag: 'latest'
  });
  
  console.log("\n=== FINAL STATUS ===");
  console.log("Mined nonce:", newMinedNonce);
  console.log("Pending nonce:", newPendingNonce);
  
  if (newPendingNonce === newMinedNonce) {
    console.log("\n🎉 All transactions cleared! You can deploy fresh now.");
  } else {
    console.log("\n⚠️  Still", newPendingNonce - newMinedNonce, "transactions pending.");
    console.log("You may need to wait longer or increase gas price further.");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
