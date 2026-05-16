/**
 * Seed script — populates Fuji with test events for smoke-testing the frontend.
 *
 * Run: npx hardhat run scripts/seed.ts --network fuji
 *
 * Steps:
 *   1. Mint MockUSDC to issuer (seller) and auditor (buyer)
 *   2. Register both wallets in the Registrar (requires RegistrationCircuit proof)
 *   3. Set auditor public key on EncryptedERC (deployer must be owner)
 *   4. Issuer deposits 1 USDC → 100 eERC units  → emits PrivateMint
 *   5. Issuer transfers 50 eERC to auditor        → emits PrivateTransfer
 *   6. Issuer posts an order on OrderBook          → emits OrderPosted
 *   7. Auditor executes the order                  → emits OrderExecuted
 *
 * NOTE: Steps 2-5 require ZK proofs. On Fuji the Registrar is deployed with prod
 * verifiers whose verification key differs from the local zkit proving key. If proof
 * verification fails those steps are skipped and only the OrderBook events are emitted.
 */

import { ethers, zkit } from "hardhat";
import { Base8, mulPointEscalar, subOrder } from "@zk-kit/baby-jubjub";
import { formatPrivKeyForBabyJub } from "maci-crypto";
import { poseidon3 } from "poseidon-lite";
import { processPoseidonEncryption } from "../src";
import type { RegistrationCircuit, TransferCircuit } from "../generated-types/zkit";
import {
  EncryptedERC__factory,
  MockUSDC__factory,
  OrderBook__factory,
  Registrar__factory,
} from "../typechain-types";
import addresses from "../../addresses.json";

// ─── Scale factors ────────────────────────────────────────────────────────────
const USDC_TO_EERC = 10_000n; // 10^(6-2) — USDC decimals 6, eERC decimals 2

// ─── Amounts ──────────────────────────────────────────────────────────────────
const MINT_USDC = 10_000_000n; // 10 USDC per wallet
const DEPOSIT_USDC = 1_000_000n; // 1 USDC → 100 eERC units
const DEPOSIT_EERC = DEPOSIT_USDC / USDC_TO_EERC; // 100
const TRANSFER_EERC = 50n; // send 50 eERC to auditor

// OrderBook order params
const ORDER_ID = BigInt(Date.now());
const ORDER_AMOUNT = 10n; // eERC units
const ORDER_PRICE = 100_000n; // 0.1 USDC per eERC unit (raw: pricePerToken in USDC×1e6)

// ─── Deterministic BJJ key derivation ─────────────────────────────────────────
// Derives a stable BabyJubJub key pair from an Ethereum private key hex string.
function deriveJubKeys(ethPrivHex: string) {
  const rawKey = BigInt(ethPrivHex);
  const formattedPrivKey = formatPrivKeyForBabyJub(rawKey) % subOrder;
  const publicKey = mulPointEscalar(Base8, formattedPrivKey).map((x) => BigInt(x)) as [
    bigint,
    bigint,
  ];
  return { rawKey, formattedPrivKey, publicKey };
}

async function main() {
  // ── Signers ──────────────────────────────────────────────────────────────────
  const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;
  const issuerKey = process.env.ISSUER_PRIVATE_KEY;
  const auditorKey = process.env.AUDITOR_PRIVATE_KEY;

  if (!deployerKey || !issuerKey || !auditorKey) {
    throw new Error("Set DEPLOYER_PRIVATE_KEY, ISSUER_PRIVATE_KEY, AUDITOR_PRIVATE_KEY in .env");
  }

  const provider = ethers.provider;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deployer = new ethers.Wallet(deployerKey, provider) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issuerWallet = new ethers.Wallet(issuerKey, provider) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditorWallet = new ethers.Wallet(auditorKey, provider) as any;

  console.log("Deployer:", deployer.address);
  console.log("Issuer  :", issuerWallet.address);
  console.log("Auditor :", auditorWallet.address);
  console.log("Network :", (await provider.getNetwork()).name);

  // ── Contract instances ────────────────────────────────────────────────────────
  const usdc = MockUSDC__factory.connect(addresses.contracts.MockUSDC, deployer);
  const eERC = EncryptedERC__factory.connect(addresses.contracts.EncryptedERC, deployer);
  const registrar = Registrar__factory.connect(addresses.contracts.Registrar, deployer);
  const orderBook = OrderBook__factory.connect(addresses.contracts.OrderBook, deployer);

  // ── Step 1: Mint USDC ─────────────────────────────────────────────────────────
  console.log("\n[1/7] Minting USDC...");
  await (await usdc.mint(issuerWallet.address, MINT_USDC)).wait();
  await (await usdc.mint(auditorWallet.address, MINT_USDC)).wait();
  console.log("  Issuer USDC:", (await usdc.balanceOf(issuerWallet.address)).toString());
  console.log("  Auditor USDC:", (await usdc.balanceOf(auditorWallet.address)).toString());

  // ── BJJ keys ─────────────────────────────────────────────────────────────────
  const issuer = deriveJubKeys(issuerKey);
  const auditor = deriveJubKeys(auditorKey);

  // ── Steps 2-5: ZK operations (skipped if proof verification fails) ────────────
  let registered = false;

  try {
    const { chainId } = await provider.getNetwork();
    const chainIdBig = BigInt(chainId);

    // ── Step 2: Register ───────────────────────────────────────────────────────
    console.log("\n[2/7] Registering wallets in Registrar...");
    const regCircuit = (await zkit.getCircuit(
      "RegistrationCircuit",
    )) as unknown as RegistrationCircuit;

    async function register(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wallet: any,
      jub: ReturnType<typeof deriveJubKeys>,
    ) {
      const alreadyRegistered = await registrar.isUserRegistered(wallet.address);
      if (alreadyRegistered) {
        console.log("  Already registered:", wallet.address);
        return;
      }
      const registrationHash = poseidon3([
        chainIdBig,
        jub.formattedPrivKey,
        BigInt(wallet.address),
      ]);
      const proof = await regCircuit.generateProof({
        SenderPrivateKey: jub.formattedPrivKey,
        SenderPublicKey: jub.publicKey,
        SenderAddress: BigInt(wallet.address),
        ChainID: chainIdBig,
        RegistrationHash: registrationHash,
      });
      const calldata = await regCircuit.generateCalldata(proof);
      await (
        await registrar.connect(wallet).register(calldata as Parameters<typeof registrar.register>[0])
      ).wait();
      console.log("  Registered:", wallet.address);
    }

    await register(issuerWallet, issuer);
    await register(auditorWallet, auditor);

    // ── Step 3: Set auditor public key ─────────────────────────────────────────
    console.log("\n[3/7] Setting auditor public key on EncryptedERC...");
    const auditorKeySet = await eERC.isAuditorKeySet();
    if (!auditorKeySet) {
      await (await eERC.connect(deployer).setAuditorPublicKey(auditorWallet.address)).wait();
      console.log("  Auditor key set to:", auditorWallet.address);
    } else {
      console.log("  Auditor key already set.");
    }

    const auditorPublicKey = await eERC.auditorPublicKey();

    // ── Step 4: Issuer deposits 1 USDC → 100 eERC ─────────────────────────────
    console.log("\n[4/7] Issuer deposits", DEPOSIT_USDC.toString(), "USDC...");
    const { ciphertext, nonce, authKey } = processPoseidonEncryption(
      [DEPOSIT_EERC],
      issuer.publicKey,
    );
    const amountPCT = [...ciphertext, ...authKey, nonce] as [
      bigint, bigint, bigint, bigint, bigint, bigint, bigint,
    ];

    await (await usdc.connect(issuerWallet).approve(await eERC.getAddress(), DEPOSIT_USDC)).wait();
    await (
      await eERC
        .connect(issuerWallet)
        ["deposit(uint256,address,uint256[7])"](
          DEPOSIT_USDC,
          await usdc.getAddress(),
          amountPCT,
        )
    ).wait();
    console.log("  PrivateMint event emitted.");

    // ── Step 5: Transfer 50 eERC to auditor ────────────────────────────────────
    console.log("\n[5/7] Transferring", TRANSFER_EERC.toString(), "eERC to auditor...");
    const TOKEN_ID = 1n;
    const issuerBal = await eERC.balanceOf(issuerWallet.address, TOKEN_ID);
    const encBal = [
      issuerBal.eGCT.c1.x,
      issuerBal.eGCT.c1.y,
      issuerBal.eGCT.c2.x,
      issuerBal.eGCT.c2.y,
    ].map(BigInt);

    const transferCircuit = (await zkit.getCircuit(
      "TransferCircuit",
    )) as unknown as TransferCircuit;

    const { encryptMessage } = await import("../src/jub/jub");
    const senderBalance = DEPOSIT_EERC;
    const senderNewBalance = senderBalance - TRANSFER_EERC;

    const { cipher: encAmtSender } = encryptMessage(issuer.publicKey, TRANSFER_EERC);
    const { cipher: encAmtReceiver, random: encAmtReceiverRandom } = encryptMessage(
      auditor.publicKey,
      TRANSFER_EERC,
    );
    const { ciphertext: rxCt, nonce: rxNonce, authKey: rxAuth, encRandom: rxRandom } =
      processPoseidonEncryption([TRANSFER_EERC], auditor.publicKey);
    const { ciphertext: audCt, nonce: audNonce, authKey: audAuth, encRandom: audRandom } =
      processPoseidonEncryption([TRANSFER_EERC], [auditorPublicKey[0], auditorPublicKey[1]]);
    const { ciphertext: sxCt, nonce: sxNonce, authKey: sxAuth } = processPoseidonEncryption(
      [senderNewBalance],
      issuer.publicKey,
    );

    const transferProof = await transferCircuit.generateProof({
      ValueToTransfer: TRANSFER_EERC,
      SenderPrivateKey: issuer.formattedPrivKey,
      SenderPublicKey: issuer.publicKey,
      SenderBalance: senderBalance,
      SenderBalanceC1: encBal.slice(0, 2),
      SenderBalanceC2: encBal.slice(2, 4),
      SenderVTTC1: encAmtSender[0],
      SenderVTTC2: encAmtSender[1],
      ReceiverPublicKey: auditor.publicKey,
      ReceiverVTTC1: encAmtReceiver[0],
      ReceiverVTTC2: encAmtReceiver[1],
      ReceiverVTTRandom: encAmtReceiverRandom,
      ReceiverPCT: rxCt,
      ReceiverPCTAuthKey: rxAuth,
      ReceiverPCTNonce: rxNonce,
      ReceiverPCTRandom: rxRandom,
      AuditorPublicKey: [auditorPublicKey[0], auditorPublicKey[1]],
      AuditorPCT: audCt,
      AuditorPCTAuthKey: audAuth,
      AuditorPCTNonce: audNonce,
      AuditorPCTRandom: audRandom,
    });
    const transferCalldata = await transferCircuit.generateCalldata(transferProof);
    const senderBalancePCT = [...sxCt, ...sxAuth, sxNonce];

    await (
      await eERC
        .connect(issuerWallet)
        [
          "transfer(address,uint256,((uint256[2],uint256[2][2],uint256[2]),uint256[32]),uint256[7])"
        ](
          auditorWallet.address,
          TOKEN_ID,
          transferCalldata as any,
          senderBalancePCT as any,
        )
    ).wait();
    console.log("  PrivateTransfer event emitted.");

    registered = true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("\n  [!] ZK operations skipped (proof incompatible with prod verifiers).");
    console.warn("  [!] Reason:", msg.slice(0, 120));
    console.warn(
      "  [!] To register wallets, generate proofs with the Go prover in contracts/zk/.",
    );
  }

  if (!registered) {
    console.log("\n[3-5/7] Skipped (ZK registration required).");
  }

  // ── Step 6: Post order ────────────────────────────────────────────────────────
  console.log("\n[6/7] Issuer posts order on OrderBook...");
  const usdcBalance = await usdc.balanceOf(issuerWallet.address);
  console.log("  Issuer USDC balance:", usdcBalance.toString());

  await (
    await orderBook
      .connect(issuerWallet)
      .postOrder(
        ORDER_ID,
        await eERC.getAddress(),
        1n, // tokenId
        ORDER_AMOUNT,
        ORDER_PRICE,
      )
  ).wait();
  console.log("  OrderPosted — orderId:", ORDER_ID.toString());

  // ── Step 7: Execute order ─────────────────────────────────────────────────────
  console.log("\n[7/7] Auditor executes the order...");
  const totalUsdc = ORDER_AMOUNT * ORDER_PRICE;
  await (await usdc.connect(auditorWallet).approve(await orderBook.getAddress(), totalUsdc)).wait();
  await (await orderBook.connect(auditorWallet).executeOrder(ORDER_ID)).wait();
  console.log("  OrderExecuted — USDC paid:", totalUsdc.toString());

  console.log("\n✓ Seed complete.");
  if (!registered) {
    console.log(
      "  EncryptedERC events skipped — register wallets with the Go prover then re-run.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
