// EIP-191 personal_sign using viem
import 'dotenv/config';
import { privateKeyToAccount } from 'viem/accounts';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const message = Buffer.concat(chunks.map(c => Buffer.isBuffer(c) ? c : Buffer.from(c))).toString('utf8');

if (!process.env.PRIVATE_KEY) {
  console.error('Missing PRIVATE_KEY env var');
  process.exit(1);
}

const account = privateKeyToAccount(
  process.env.PRIVATE_KEY.startsWith('0x')
    ? process.env.PRIVATE_KEY
    : `0x${process.env.PRIVATE_KEY}`
);

const sig = await account.signMessage({ message });
process.stdout.write(sig);

