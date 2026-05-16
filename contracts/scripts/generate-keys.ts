import { ethers } from "ethers";

function generateWallet(label: string) {
	const wallet = ethers.Wallet.createRandom();
	console.log(`\n${label}`);
	console.log(`  Address:     ${wallet.address}`);
	console.log(`  Private Key: ${wallet.privateKey}`);
	return { address: wallet.address, privateKey: wallet.privateKey };
}

const auditor = generateWallet("Auditor (CNBV)");
const issuer = generateWallet("Issuer (Arkangeles)");

console.log(`
Paste into .env:
  AUDITOR_ADDRESS=${auditor.address}
  AUDITOR_PRIVATE_KEY=${auditor.privateKey}
  ISSUER_ADDRESS=${issuer.address}
  ISSUER_PRIVATE_KEY=${issuer.privateKey}
`);
