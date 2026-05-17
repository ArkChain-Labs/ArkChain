/**
 * post-order.ts — posts a new open order on the OrderBook without executing it.
 *
 * Prereqs: seed-investor.ts must have run (issuer has 25 eERC remaining).
 *
 * Run: npx hardhat run scripts/post-order.ts --network fuji
 */

import { ethers } from "hardhat";
import { OrderBook__factory, MockUSDC__factory } from "../typechain-types";
import addresses from "../../addresses.json";

const TOKEN_AMOUNT     = 10n;
const PRICE_PER_TOKEN  = 100_000n; // 0.10 USDC (6 decimals) = ~1.75 MXN

async function main() {
  const issuerKey = process.env.ISSUER_PRIVATE_KEY;
  if (!issuerKey) throw new Error("Set ISSUER_PRIVATE_KEY in .env");

  const provider     = ethers.provider;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issuerWallet = new ethers.Wallet(issuerKey, provider) as any;

  console.log("Issuer  :", issuerWallet.address);
  console.log("Network :", (await provider.getNetwork()).name);

  const orderBook = OrderBook__factory.connect(addresses.contracts.OrderBook, issuerWallet);
  const usdc      = MockUSDC__factory.connect(addresses.contracts.MockUSDC, issuerWallet);

  // Approve OrderBook to spend USDC (needed for executeOrder later, harmless now)
  const allowance = await usdc.allowance(issuerWallet.address, addresses.contracts.OrderBook);
  if (allowance < 10_000_000n) {
    console.log("\n[1/2] Approving USDC...");
    await (await usdc.approve(addresses.contracts.OrderBook, 10_000_000n)).wait();
    console.log("  Approved.");
  } else {
    console.log("\n[1/2] USDC already approved.");
  }

  const orderId = BigInt(Date.now());

  console.log("\n[2/2] Posting order...");
  const tx = await orderBook.postOrder(
    orderId,
    addresses.contracts.EncryptedERC,
    1n,
    TOKEN_AMOUNT,
    PRICE_PER_TOKEN,
  );
  await tx.wait();

  console.log("  OrderPosted — orderId:", orderId.toString());
  console.log("  Tokens:", TOKEN_AMOUNT.toString());
  console.log("  Price/token: 0.10 USDC (~$1.75 MXN)");
  console.log("  Total: 1.00 USDC (~$17.50 MXN)");
  console.log("\n✓ Done. Order is now open on-chain.");
  console.log("  Check: https://testnet.snowtrace.io/address/" + addresses.contracts.OrderBook);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
