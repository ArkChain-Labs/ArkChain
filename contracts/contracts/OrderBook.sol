// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Privacy-preserving eERC20 tokens cannot be transferred by a third-party contract
// because the ZK transfer circuit commits to msg.sender as the token holder.
// Therefore, executeOrder atomically settles the USDC leg, and the seller separately
// calls eERC.transfer(buyer, ...) directly — which the Wavy Node backend enforces
// by monitoring OrderExecuted events and flagging unfinished settlements.

contract OrderBook {
    using SafeERC20 for IERC20;

    enum Status { Active, Cancelled, Executed }

    struct Order {
        address seller;
        address eERC20;   // address of the EncryptedERC contract
        uint256 tokenId;  // token ID inside the eERC20 (1-indexed per deposited ERC20)
        uint256 amount;   // encrypted token units (eERC20 decimals)
        uint256 pricePerToken; // USDC per encrypted token unit (USDC decimals)
        Status status;
    }

    IERC20 public immutable usdc;
    mapping(uint256 => Order) public orders;

    event OrderPosted(
        uint256 indexed orderId,
        address indexed seller,
        address eERC20,
        uint256 tokenId,
        uint256 amount,
        uint256 pricePerToken
    );

    event OrderCancelled(uint256 indexed orderId, address indexed seller);

    // Backend listens for this event and requires seller to call
    // eERC20.transfer(buyer, tokenId, proof, balancePCT) within a time window.
    event OrderExecuted(
        uint256 indexed orderId,
        address indexed seller,
        address indexed buyer,
        address eERC20,
        uint256 tokenId,
        uint256 amount,
        uint256 usdcTotal
    );

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    // Seller registers a new ask order.
    function postOrder(
        uint256 orderId,
        address eERC20,
        uint256 tokenId,
        uint256 amount,
        uint256 pricePerToken
    ) external {
        require(orders[orderId].seller == address(0), "OrderBook: id taken");
        require(amount > 0 && pricePerToken > 0, "OrderBook: invalid params");

        orders[orderId] = Order({
            seller: msg.sender,
            eERC20: eERC20,
            tokenId: tokenId,
            amount: amount,
            pricePerToken: pricePerToken,
            status: Status.Active
        });

        emit OrderPosted(orderId, msg.sender, eERC20, tokenId, amount, pricePerToken);
    }

    // Only the original seller can cancel an active order.
    function cancelOrder(uint256 orderId) external {
        Order storage o = orders[orderId];
        require(o.seller == msg.sender, "OrderBook: not seller");
        require(o.status == Status.Active, "OrderBook: not active");

        o.status = Status.Cancelled;
        emit OrderCancelled(orderId, msg.sender);
    }

    // Buyer executes an active order.
    // Atomically transfers USDC from buyer to seller.
    // Emits OrderExecuted so the backend can enforce the seller's eERC20 token delivery.
    // Buyer must have pre-approved this contract for (amount * pricePerToken) USDC.
    function executeOrder(uint256 orderId) external {
        Order storage o = orders[orderId];
        require(o.status == Status.Active, "OrderBook: not active");

        uint256 total = o.amount * o.pricePerToken;
        o.status = Status.Executed;

        usdc.safeTransferFrom(msg.sender, o.seller, total);

        emit OrderExecuted(
            orderId,
            o.seller,
            msg.sender,
            o.eERC20,
            o.tokenId,
            o.amount,
            total
        );
    }
}
