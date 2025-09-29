# DIDLab Minimal ERC-20 DApp

**Single-file web DApp that:**
  - Connects to MetaMask and adds/switches to your DIDLab chain
  - Loads an ERC-20 by address and shows name / symbol / decimals
  - Displays the balance of the connected account
  - Sends transfer(to, amount) with proper decimal conversion
  - Auto-refreshes balance when a Transfer event involves the account
  - Lets you add the token to MetaMask via wallet_watchAsset
  - Persists RPC URL, Chain ID, and Token address in localStorage

## Team Info  
  - **Team number:** 3
  - **RPC URL:** https://hh-03.didlab.org
  - **Chain ID (decimal):** 32339
  - **Token address:** 0x49fd2be640db2910c2fab69bb8531ab6e76127ff

## How to run locally
**Requirement:** Nodee 22.x (or any static server).
```npx http-server -p 800```

Open ```http:localhost:8000/``` and:
    1. Enter **RPC URL**, **Chain ID**, and **Token address**
    2. Click **Connect & Switch Netowk**
    3. Click **Load Token**
    4. User **Transfer** section

  ## Screenshots to include 

  **Connected state (account & network visible):**

  <img width="946" height="724" alt="image" src="https://github.com/user-attachments/assets/1b9b8afa-5081-4753-bcd0-c1ad9aa8017b" />



**Token loaded (name/symbol/decimals):**

<img width="919" height="694" alt="image" src="https://github.com/user-attachments/assets/baa35adc-9f21-43e7-a602-b6e30165aa98" />


**Successful transfer with tx hash, block, and gas/fee:**

<img width="928" height="789" alt="image" src="https://github.com/user-attachments/assets/8da920e1-fb14-4c61-a7f3-847ad932c552" />


**Token added in MetaMask assets:**

<img width="953" height="887" alt="image" src="https://github.com/user-attachments/assets/e5946488-d584-4564-8f12-b983bcd5bed6" />

## Notes on acceptance checks
  - Connect adds/switches to the DIDLab chain — we call ```wallet_addEthereumChain``` or ```wallet_switchEthereumChain``` with your Chain ID (converted to hex) and team RPC.
  - Token metadata is read on-chain via name, symbol, decimals.
  - Balance uses ```balanceOf(account)``` and is shown in human units via ```formatUnits(...)```.
  - Transfer uses Viem ```writeContract```; we show hash, mined block, gasUsed, effectiveGasPrice, and computed fee.
  - Updates — Subscribes to the ERC-20 Transfer event. If a log’s from or to equals the connected account, it calls Refresh.
  - Wallet integration — Button calls ```wallet_watchAsset``` to add your ERC-20.

## Error handling & UX touches
  - Validates RPC URL, Chain ID, and addresses.
  - Clear, color-coded log lines: .ok, .warn, .err.
  - Persists inputs via localStorage to survive reloads.
  - Reacts to accountsChanged and chainChanged events.

## Issues & fixes 
  - Wrong token / non-ERC20: Reading name/symbol/decimals could revert. We wrap reads and show a friendly error, prompting the correct token.
  - Chain mismatch: If MetaMask chain changes, the app rebuilds clients, updates the UI, and warns the user to reload the token.
  - Fee reporting: On EIP-1559 networks we multiply effectiveGasPrice * gasUsed and display the approx ETH fee; if either is missing, we still show block & gas used.
  - Event stream hiccups: If watchContractEvent errors, we log a warning but keep the app usable (manual Refresh still works).

