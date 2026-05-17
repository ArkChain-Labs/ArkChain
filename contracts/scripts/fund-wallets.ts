import { ethers } from "hardhat";

async function main() {
  const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;
  const issuerKey = process.env.ISSUER_PRIVATE_KEY;
  const auditorKey = process.env.AUDITOR_PRIVATE_KEY;
  if (!deployerKey || !issuerKey || !auditorKey) throw new Error("Missing keys in .env");

  const provider = ethers.provider;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deployer = new ethers.Wallet(deployerKey, provider) as any;
  const issuerWallet = new ethers.Wallet(issuerKey, provider);
  const auditorWallet = new ethers.Wallet(auditorKey, provider);

  const deployerBal = await provider.getBalance(deployer.address);
  const issuerBal = await provider.getBalance(issuerWallet.address);
  const auditorBal = await provider.getBalance(auditorWallet.address);
  console.log("Deployer AVAX:", ethers.formatEther(deployerBal));
  console.log("Issuer   AVAX:", ethers.formatEther(issuerBal));
  console.log("Auditor  AVAX:", ethers.formatEther(auditorBal));

  const FUND = ethers.parseEther("0.05");

  if (issuerBal < FUND) {
    console.log("\nFunding Issuer with 0.05 AVAX...");
    const tx = await deployer.sendTransaction({ to: issuerWallet.address, value: FUND });
    await tx.wait();
    console.log("  Done:", tx.hash);
  }

  if (auditorBal < FUND) {
    console.log("Funding Auditor with 0.05 AVAX...");
    const tx = await deployer.sendTransaction({ to: auditorWallet.address, value: FUND });
    await tx.wait();
    console.log("  Done:", tx.hash);
  }

  console.log("\nIssuer   AVAX:", ethers.formatEther(await provider.getBalance(issuerWallet.address)));
  console.log("Auditor  AVAX:", ethers.formatEther(await provider.getBalance(auditorWallet.address)));
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
