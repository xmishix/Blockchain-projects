# Report of assignment
This is the report for assignment 2. I will be implementing the Optional Tasks later.

## Part A -- Deployment


## Part B -- Transaction Details (tx1/tx2/tx3)


## Part C -- Fee Comparison (tx1 vs tx2)
Look at the screenshots at the bottom, and you’ll see that tx1 landed first (followed by tx2, then tx3).

For effective gas price and priority tip:
- tx1
  * Effective gas price: 1,769,606,477 wei
  * Priority fee: 1,000,000,000 wei
- tx2
  * Effective gas price: 3,673,578,355 wei
  * Priority fee: 3,000,000,000 wei
- tx3
  * Effective gas price: 2,589,532,201 wei
  * Priority fee: 2,000,000,000 wei
-> tx2 had the highest effective gas price and the highest priority fee (tip).

Brief EIP-1559 explanation (bsse fee + tip):
  **Base Fee**:
    - A mandatory minimum per-gas price set by the network.
    - It adjusts up or down depending on the block congestion.
    - This fee is burned (destroyed), reducing ETH supply.
  **Priority Fee (Tip)**:
    - An additional amount a user offers to miners/validators as an incentive to include their transaction quickly.
    - A higher tip increases the chance of faster inclusion.
  **Max Fee Per Gas**:
    - The maximum amount a user is willing to pay per unit of gas.
    - The actual cost = Base Fee + Priority Fee, capped by the Max Fee.

    
## Part D -- Decimals & Conversion
Example: 'Transfer' event in tx1
- Raw value (wei):
  100000000000000000000
- Human-readable (divided by 1e18):
  100.0


# Screenshots
 Open terminal in localhost to listen for incomming blocks:
 <img width="740" height="260" alt="image" src="https://github.com/user-attachments/assets/f5febb82-60e4-4aa4-8283-0ab13f126cf6" />

Deploy output:
<img width="647" height="169" alt="image" src="https://github.com/user-attachments/assets/2bb10011-8819-464d-9edc-26e145100195" />

Interact output:
<img width="687" height="329" alt="image" src="https://github.com/user-attachments/assets/69cd7131-92e8-49ed-ac83-66975c8302e5" />

Analyze output:
<img width="630" height="431" alt="image" src="https://github.com/user-attachments/assets/4ecaa348-d7fa-4786-95bc-f4aff57f3f91" />
<img width="638" height="680" alt="image" src="https://github.com/user-attachments/assets/f433d618-46aa-4332-9a3f-2ad661b0a9bb" />
