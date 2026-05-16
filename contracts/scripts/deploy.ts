import { ethers, network } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";
import { deployLibrary, deployVerifiers } from "../test/helpers";
import {
	EncryptedERC__factory,
	MockUSDC__factory,
	OrderBook__factory,
} from "../typechain-types";

async function main() {
	const [deployer] = await ethers.getSigners();
	console.log("Deployer:", deployer.address);
	console.log("Network:", network.name);

	const auditorAddress = process.env.AUDITOR_ADDRESS;
	const issuerAddress = process.env.ISSUER_ADDRESS;
	if (!auditorAddress || !issuerAddress) {
		throw new Error(
			"Set AUDITOR_ADDRESS and ISSUER_ADDRESS in .env — run scripts/generate-keys.ts first",
		);
	}

	// 1. MockUSDC
	console.log("\n[1/5] Deploying MockUSDC...");
	const mockUSDC = await new MockUSDC__factory(deployer).deploy();
	await mockUSDC.waitForDeployment();
	console.log("  MockUSDC:", mockUSDC.target);

	// 2. eERC20 verifiers (prod verifiers with proper trusted setup for Fuji)
	console.log("\n[2/5] Deploying eERC20 verifiers...");
	const isProd = network.name === "fuji";
	const verifiers = await deployVerifiers(deployer, isProd);
	console.log("  Verifiers:", verifiers);

	// 3. BabyJubJub library
	console.log("\n[3/5] Deploying BabyJubJub library...");
	const babyJubJub = await deployLibrary(deployer);
	console.log("  BabyJubJub:", babyJubJub);

	// 4. Registrar
	console.log("\n[4/5] Deploying Registrar...");
	const registrarFactory = await ethers.getContractFactory("Registrar");
	const registrar = await registrarFactory.deploy(
		verifiers.registrationVerifier,
	);
	await registrar.waitForDeployment();
	console.log("  Registrar:", registrar.target);

	// 5. EncryptedERC (Converter mode — wraps MockUSDC)
	console.log("\n[5/5] Deploying EncryptedERC (Converter)...");
	const encryptedERC = await new EncryptedERC__factory(
		{ "contracts/libraries/BabyJubJub.sol:BabyJubJub": babyJubJub },
		deployer,
	).deploy({
		registrar: registrar.target,
		isConverter: true,
		name: "ArkChain eToken",
		symbol: "eARK",
		mintVerifier: verifiers.mintVerifier,
		withdrawVerifier: verifiers.withdrawVerifier,
		transferVerifier: verifiers.transferVerifier,
		burnVerifier: verifiers.burnVerifier,
		decimals: 2,
	});
	await encryptedERC.waitForDeployment();
	console.log("  EncryptedERC:", encryptedERC.target);

	// 6. OrderBook
	console.log("\n[6/6] Deploying OrderBook...");
	const orderBook = await new OrderBook__factory(deployer).deploy(
		mockUSDC.target,
	);
	await orderBook.waitForDeployment();
	console.log("  OrderBook:", orderBook.target);

	// 7. Write addresses.json to repo root
	const addresses = {
		network: network.name,
		chainId: (await ethers.provider.getNetwork()).chainId.toString(),
		deployedAt: new Date().toISOString(),
		auditorAddress,
		issuerAddress,
		contracts: {
			MockUSDC: mockUSDC.target,
			EncryptedERC: encryptedERC.target,
			Registrar: registrar.target,
			OrderBook: orderBook.target,
		},
		verifiers,
	};

	const outPath = join(__dirname, "../../addresses.json");
	writeFileSync(outPath, JSON.stringify(addresses, null, 2));
	console.log("\naddresses.json written to:", outPath);
	console.table(addresses.contracts);
}

main().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
