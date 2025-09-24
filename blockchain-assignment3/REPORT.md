# Report for Assignment 3

## Console Ouput
**Deploy.ts**
<img width="645" height="232" alt="image" src="https://github.com/user-attachments/assets/b43345ea-c602-4485-aba9-d7b68f212b2f" />

**Transfer-approve.ts**
<img width="760" height="295" alt="image" src="https://github.com/user-attachments/assets/824d0264-4002-4d35-b1f6-fc8ff5934573" />

**Airdrop.ts**
<img width="763" height="156" alt="image" src="https://github.com/user-attachments/assets/9525e80a-1073-46f8-ac6d-9a8077a8b27d" />

**Logs-query.ts**
<img width="650" height="894" alt="image" src="https://github.com/user-attachments/assets/8261640c-18cd-438f-8f5b-50bd5170dc0b" />
<img width="630" height="561" alt="image" src="https://github.com/user-attachments/assets/07c6543e-f94e-4e12-8bdf-5b14254b8945" />


## Screenshot of MetaMask
**Sending 100 ETH over metamast**
<img width="836" height="932" alt="image" src="https://github.com/user-attachments/assets/f3df37f8-ab1d-4966-8723-4140784dbb25" />

**Confirmation of 100 ETH in MetaMask**
<img width="328" height="664" alt="image" src="https://github.com/user-attachments/assets/08924ac1-1db4-41d9-8151-313f2e4660c3" />

***Logs-query.ts after tranfer of 100 ETH in MetaMask**
<img width="647" height="723" alt="image" src="https://github.com/user-attachments/assets/d4628d63-8d96-465b-900a-d814ac198a8c" />



## Short Writeup
**a. Enforcement of cap, pause, and roles**
*Cap*: Enforced through the ERC20 supply logic at deployment. The total supply was fixed (1,000,000 CAMP), and minting beyond this amount is not possible. This guarantees no inflation above the cap.
*Pause*: The contract integrated OpenZeppelin’s Pausable modifier. Transfers, approvals, and airdrops automatically revert if the contract is paused. This gives the admin an emergency stop mechanism.
*Roles*: Role-based access control (DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE) was enforced via OpenZeppelin’s AccessControl. Logs confirm that the deployer was granted all three roles at block 67. Only addresses with the correct role can mint new tokens, pause/unpause, or reassign roles.

**b. Why batch airdrop saved (or didn’t save) gas**
The batch airdrop consumed 40,795 gas compared to 29,212 gas for one single transfer. When simulating multiple singles (≈2×29,212 = 58,424 gas), the batch came out ~39.65% cheaper.
R*eason:* batching avoids repeating per-transaction overhead (nonce increment, calldata overhead, separate logs, base transaction cost). By grouping multiple transfers into one function call, you amortized these fixed costs.

**c. Issues encountered and fixes**
*Empty recipient*: Initially, the RECIPIENT env var was blank. This caused confusion during the transfer test, but the script defaulted to self-transfer, so balances did not change. *Fix*: explicitly set RECIPIENT in .env.
*Event duplication in logs*: Running logs-query.ts twice showed duplicate events. This was not a bug in the contract but because the script fetched the same block range twice. *Fix*: narrow the block range or track the last queried block.
Gas comparison mismatch: At first glance, the batch looked more expensive than one single transfer, but the point was relative savings vs. multiple singles. Clarified by comparing against the cumulative single-transfer total.



