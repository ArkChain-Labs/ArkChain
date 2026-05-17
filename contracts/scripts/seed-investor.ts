/**
 * seed-investor.ts — registers the INVESTOR wallet and receives 25 eERC from the Issuer.
 *
 * Prereqs: seed.ts must have run successfully so the Issuer already has 50 eERC
 * (deposited 100, transferred 50 to Auditor → 50 remaining).
 *
 * Run: npx hardhat run scripts/seed-investor.ts --network fuji
 */

import { ethers, zkit } from "hardhat";
import { Base8, mulPointEscalar, subOrder } from "@zk-kit/baby-jubjub";
import { formatPrivKeyForBabyJub } from "maci-crypto";
import { poseidon3 } from "poseidon-lite";
import { processPoseidonEncryption } from "../src";
import type { RegistrationCircuit, TransferCircuit } from "../generated-types/zkit";
import { EncryptedERC__factory, Registrar__factory } from "../typechain-types";
import addresses from "../../addresses.json";

// Issuer's eERC state after seed.ts:
//   deposited 100 eERC, transferred 50 to auditor → 50 remaining
const ISSUER_CURRENT_BALANCE = 50n;
const TRANSFER_TO_INVESTOR   = 25n;
const ISSUER_NEW_BALANCE     = ISSUER_CURRENT_BALANCE - TRANSFER_TO_INVESTOR; // 25

const TOKEN_ID = 1n;

function deriveJubKeys(ethPrivHex: string) {
  const rawKey = BigInt(ethPrivHex);
  const formattedPrivKey = formatPrivKeyForBabyJub(rawKey) % subOrder;
  const publicKey = mulPointEscalar(Base8, formattedPrivKey).map((x) => BigInt(x)) as [bigint, bigint];
  return { rawKey, formattedPrivKey, publicKey };
}

async function main() {
  const issuerKey   = process.env.ISSUER_PRIVATE_KEY;
  const investorKey = process.env.INVESTOR_PRIVATE_KEY;

  if (!issuerKey || !investorKey) {
    throw new Error("Set ISSUER_PRIVATE_KEY and INVESTOR_PRIVATE_KEY in .env");
  }

  const provider = ethers.provider;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issuerWallet   = new ethers.Wallet(issuerKey,   provider) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const investorWallet = new ethers.Wallet(investorKey, provider) as any;

  console.log("Issuer  :", issuerWallet.address);
  console.log("Investor:", investorWallet.address);
  console.log("Network :", (await provider.getNetwork()).name);

  const eERC     = EncryptedERC__factory.connect(addresses.contracts.EncryptedERC, issuerWallet);
  const registrar = Registrar__factory.connect(addresses.contracts.Registrar, issuerWallet);

  const issuer   = deriveJubKeys(issuerKey);
  const investor = deriveJubKeys(investorKey);

  // ── Step A: Fund investor with AVAX for gas ───────────────────────────────────
  const investorAvax = await provider.getBalance(investorWallet.address);
  if (investorAvax < ethers.parseEther("0.02")) {
    console.log("\n[A] Funding investor with 0.03 AVAX...");
    const tx = await issuerWallet.sendTransaction({
      to: investorWallet.address,
      value: ethers.parseEther("0.03"),
    });
    await tx.wait();
    console.log("  Done:", tx.hash);
  } else {
    console.log("\n[A] Investor already has AVAX:", ethers.formatEther(investorAvax));
  }

  // ── Step B: Register investor in Registrar ────────────────────────────────────
  console.log("\n[B] Registering investor...");
  const alreadyRegistered = await registrar.isUserRegistered(investorWallet.address);
  if (!alreadyRegistered) {
    const { chainId } = await provider.getNetwork();
    const chainIdBig = BigInt(chainId);
    const regCircuit = (await zkit.getCircuit("RegistrationCircuit")) as unknown as RegistrationCircuit;

    const registrationHash = poseidon3([
      chainIdBig,
      investor.formattedPrivKey,
      BigInt(investorWallet.address),
    ]);
    const proof    = await regCircuit.generateProof({
      SenderPrivateKey: investor.formattedPrivKey,
      SenderPublicKey:  investor.publicKey,
      SenderAddress:    BigInt(investorWallet.address),
      ChainID:          chainIdBig,
      RegistrationHash: registrationHash,
    });
    const calldata = await regCircuit.generateCalldata(proof);
    await (
      await registrar.connect(investorWallet).register(calldata as Parameters<typeof registrar.register>[0])
    ).wait();
    console.log("  Registered:", investorWallet.address);
  } else {
    console.log("  Already registered:", investorWallet.address);
  }

  // ── Step C: Transfer 25 eERC from Issuer → Investor ──────────────────────────
  console.log("\n[C] Transferring", TRANSFER_TO_INVESTOR.toString(), "eERC to investor...");

  const issuerBal = await eERC.balanceOf(issuerWallet.address, TOKEN_ID);
  const encBal = [
    issuerBal.eGCT.c1.x,
    issuerBal.eGCT.c1.y,
    issuerBal.eGCT.c2.x,
    issuerBal.eGCT.c2.y,
  ].map(BigInt);

  const auditorPublicKey = await eERC.auditorPublicKey();

  const transferCircuit = (await zkit.getCircuit("TransferCircuit")) as unknown as TransferCircuit;
  const { encryptMessage } = await import("../src/jub/jub");

  const { cipher: encAmtSender }   = encryptMessage(issuer.publicKey,   TRANSFER_TO_INVESTOR);
  const { cipher: encAmtReceiver, random: encAmtReceiverRandom } = encryptMessage(investor.publicKey, TRANSFER_TO_INVESTOR);

  const { ciphertext: rxCt,  nonce: rxNonce,  authKey: rxAuth,  encRandom: rxRandom }  =
    processPoseidonEncryption([TRANSFER_TO_INVESTOR], investor.publicKey);
  const { ciphertext: audCt, nonce: audNonce, authKey: audAuth, encRandom: audRandom } =
    processPoseidonEncryption([TRANSFER_TO_INVESTOR], [auditorPublicKey[0], auditorPublicKey[1]]);
  const { ciphertext: sxCt,  nonce: sxNonce,  authKey: sxAuth } =
    processPoseidonEncryption([ISSUER_NEW_BALANCE], issuer.publicKey);

  const transferProof = await transferCircuit.generateProof({
    ValueToTransfer:    TRANSFER_TO_INVESTOR,
    SenderPrivateKey:   issuer.formattedPrivKey,
    SenderPublicKey:    issuer.publicKey,
    SenderBalance:      ISSUER_CURRENT_BALANCE,
    SenderBalanceC1:    encBal.slice(0, 2),
    SenderBalanceC2:    encBal.slice(2, 4),
    SenderVTTC1:        encAmtSender[0],
    SenderVTTC2:        encAmtSender[1],
    ReceiverPublicKey:  investor.publicKey,
    ReceiverVTTC1:      encAmtReceiver[0],
    ReceiverVTTC2:      encAmtReceiver[1],
    ReceiverVTTRandom:  encAmtReceiverRandom,
    ReceiverPCT:        rxCt,
    ReceiverPCTAuthKey: rxAuth,
    ReceiverPCTNonce:   rxNonce,
    ReceiverPCTRandom:  rxRandom,
    AuditorPublicKey:   [auditorPublicKey[0], auditorPublicKey[1]],
    AuditorPCT:         audCt,
    AuditorPCTAuthKey:  audAuth,
    AuditorPCTNonce:    audNonce,
    AuditorPCTRandom:   audRandom,
  });
  const transferCalldata = await transferCircuit.generateCalldata(transferProof);
  const senderBalancePCT = [...sxCt, ...sxAuth, sxNonce];

  await (
    await eERC.connect(issuerWallet)[
      "transfer(address,uint256,((uint256[2],uint256[2][2],uint256[2]),uint256[32]),uint256[7])"
    ](
      investorWallet.address,
      TOKEN_ID,
      transferCalldata as any,
      senderBalancePCT as any,
    )
  ).wait();

  console.log("  PrivateTransfer → Investor emitted.");
  console.log("\n✓ Done. Investor:", investorWallet.address);
  console.log("  Check on Snowtrace: https://testnet.snowtrace.io/address/" + investorWallet.address);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
