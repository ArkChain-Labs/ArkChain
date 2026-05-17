import { ethers, network } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";
import { OrderBook__factory } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const auditorAddress = process.env.AUDITOR_ADDRESS!;
  const issuerAddress = process.env.ISSUER_ADDRESS!;

  const contracts = {
    MockUSDC:     "0x8A9dA79B24b8b3b5B8F68753a071A1E7d8203B15",
    EncryptedERC: "0xA28f0402f262e8a2b4d61Ee1f6b5026055687458",
    Registrar:    "0x569cba37c704d3e13D2DaAd8dB7805ABdd0060A7",
  };
  const verifiers = {
    registrationVerifier: "0x522F834dC3474887C41D6638ec08C1c9D821e2B4",
    mintVerifier:         "0xD44410CAB4FAa2FD99E30d6856C20FA747635fC2",
    withdrawVerifier:     "0x59aDDb1964C5463fA6Dcc1aF902e88fFe9B39bfF",
    transferVerifier:     "0xA2BA923133AA5c902726be99a225350789f42fBB",
    burnVerifier:         "0x9ecbA41fA0961BCCD70D4F4f4c36E36EAA6fEADf",
  };

  console.log("Deploying OrderBook...");
  const orderBook = await new OrderBook__factory(deployer).deploy(contracts.MockUSDC);
  await orderBook.waitForDeployment();
  console.log("  OrderBook:", orderBook.target);

  const addresses = {
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
    auditorAddress,
    issuerAddress,
    contracts: { ...contracts, OrderBook: orderBook.target.toString() },
    verifiers,
  };

  const outPath = join(__dirname, "../../addresses.json");
  writeFileSync(outPath, JSON.stringify(addresses, null, 2));
  console.log("addresses.json written.");
  console.table(addresses.contracts);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
