import { expect } from "chai";
import { ethers, zkit } from "hardhat";
import { processPoseidonEncryption } from "../src";
import { deployLibrary, deployVerifiers, privateTransfer } from "./helpers";
import { User } from "./user";
import type { RegistrationCircuit } from "../generated-types/zkit";
import {
	EncryptedERC__factory,
	MockUSDC__factory,
	OrderBook__factory,
	Registrar__factory,
} from "../typechain-types";

// USDC has 6 decimals, eERC has 2 → scale factor 10^(6-2) = 10_000
const USDC_TO_EERC = 10_000n;

describe("ArkChain smoke test — full e2e flow", () => {
	it("USDC mint → eERC deposit → postOrder → executeOrder verifies balances moved", async () => {
		const signers = await ethers.getSigners();
		const deployer = signers[0];
		const sellerSigner = signers[1];
		const buyerSigner = signers[2];
		const auditorSigner = signers[3];

		// ── 1. Deploy infrastructure ──────────────────────────────────────────
		const verifiers = await deployVerifiers(deployer);
		const babyJubJub = await deployLibrary(deployer);

		const registrar = await new Registrar__factory(deployer).deploy(
			verifiers.registrationVerifier,
		);
		await registrar.waitForDeployment();

		const usdc = await new MockUSDC__factory(deployer).deploy();
		await usdc.waitForDeployment();

		const eERC = await new EncryptedERC__factory(
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
		await eERC.waitForDeployment();

		const orderBook = await new OrderBook__factory(deployer).deploy(
			usdc.target,
		);
		await orderBook.waitForDeployment();

		// ── 2. Mint USDC to seller and buyer ──────────────────────────────────
		await (await usdc.mint(sellerSigner.address, 5_000_000n)).wait(); // 5 USDC
		await (await usdc.mint(buyerSigner.address, 1_000_000n)).wait(); // 1 USDC

		// ── 3. Build BabyJubJub key pairs ─────────────────────────────────────
		const auditorUser = new User(auditorSigner);
		const sellerUser = new User(sellerSigner);
		const buyerUser = new User(buyerSigner);

		// ── 4. Register users with the Registrar ─────────────────────────────
		const { chainId } = await ethers.provider.getNetwork();
		const regCircuit = (await zkit.getCircuit(
			"RegistrationCircuit",
		)) as unknown as RegistrationCircuit;

		async function register(user: User) {
			const proof = await regCircuit.generateProof({
				SenderPrivateKey: user.formattedPrivateKey,
				SenderPublicKey: user.publicKey,
				SenderAddress: BigInt(user.signer.address),
				ChainID: chainId,
				RegistrationHash: user.genRegistrationHash(chainId),
			});
			await (
				await registrar
					.connect(user.signer)
					.register(await regCircuit.generateCalldata(proof) as any)
			).wait();
		}

		await register(auditorUser);
		await register(sellerUser);
		await register(buyerUser);

		// ── 5. Set auditor ────────────────────────────────────────────────────
		await (
			await eERC.connect(deployer).setAuditorPublicKey(auditorSigner.address)
		).wait();

		// ── 6. Seller deposits 1 USDC → 100 eERC units ───────────────────────
		const DEPOSIT_USDC = 1_000_000n;
		const DEPOSIT_EERC = DEPOSIT_USDC / USDC_TO_EERC; // 100

		const { ciphertext, nonce, authKey } = processPoseidonEncryption(
			[DEPOSIT_EERC],
			sellerUser.publicKey,
		);
		const amountPCT = [...ciphertext, ...authKey, nonce] as [
			bigint, bigint, bigint, bigint, bigint, bigint, bigint,
		];

		await (await usdc.connect(sellerSigner).approve(eERC.target, DEPOSIT_USDC)).wait();
		await (
			await eERC
				.connect(sellerSigner)
				["deposit(uint256,address,uint256[7])"](DEPOSIT_USDC, usdc.target, amountPCT)
		).wait();

		const TOKEN_ID = 1n; // first token registered on deposit

		// ── 7. Seller posts order: sell 10 eERC units at 1 raw USDC each ─────
		const ORDER_ID = 1n;
		const ORDER_AMOUNT = 10n; // eERC units
		const PRICE = 1n; // raw USDC per eERC unit

		await (
			await orderBook
				.connect(sellerSigner)
				.postOrder(ORDER_ID, eERC.target, TOKEN_ID, ORDER_AMOUNT, PRICE)
		).wait();

		// ── 8. Buyer approves and calls executeOrder (USDC leg) ───────────────
		const totalUsdc = ORDER_AMOUNT * PRICE;
		await (await usdc.connect(buyerSigner).approve(orderBook.target, totalUsdc)).wait();

		const buyerUsdcBefore = await usdc.balanceOf(buyerSigner.address);
		const sellerUsdcBefore = await usdc.balanceOf(sellerSigner.address);

		await (await orderBook.connect(buyerSigner).executeOrder(ORDER_ID)).wait();

		// ── 9. Assert USDC moved ──────────────────────────────────────────────
		expect(await usdc.balanceOf(buyerSigner.address)).to.equal(
			buyerUsdcBefore - totalUsdc,
			"buyer USDC decreased",
		);
		expect(await usdc.balanceOf(sellerSigner.address)).to.equal(
			sellerUsdcBefore + totalUsdc,
			"seller USDC increased",
		);

		// ── 10. Seller transfers eERC tokens directly to buyer (token leg) ────
		const sellerBal = await eERC.balanceOf(sellerSigner.address, TOKEN_ID);
		const sellerEncBal = [
			sellerBal.eGCT.c1.x,
			sellerBal.eGCT.c1.y,
			sellerBal.eGCT.c2.x,
			sellerBal.eGCT.c2.y,
		].map(BigInt);

		const { proof: transferCalldata, senderBalancePCT } = await privateTransfer(
			sellerUser,
			DEPOSIT_EERC,
			buyerUser.publicKey,
			ORDER_AMOUNT,
			sellerEncBal,
			auditorUser.publicKey,
		);

		await (
			await eERC
				.connect(sellerSigner)
				["transfer(address,uint256,((uint256[2],uint256[2][2],uint256[2]),uint256[32]),uint256[7])"](
					buyerSigner.address,
					TOKEN_ID,
					transferCalldata as any,
					senderBalancePCT as any,
				)
		).wait();

		// ── 11. Assert eERC moved (buyer has a non-zero encrypted balance) ────
		const buyerBal = await eERC.balanceOf(buyerSigner.address, TOKEN_ID);
		expect(buyerBal.eGCT.c1.x).to.not.equal(0n, "buyer eERC balance non-zero");

		console.log("✓ Buyer USDC decreased by", totalUsdc.toString(), "raw units");
		console.log("✓ Seller USDC increased by", totalUsdc.toString(), "raw units");
		console.log("✓ eERC tokens transferred — buyer encrypted balance confirmed");
	});
});
