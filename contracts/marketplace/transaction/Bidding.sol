// transaction/Bidding.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

library Bidding {
    struct Bid {
        address buyer;
        uint256 bidPrice;
    }

    // Offer event
    event Offer(address indexed _buyer, uint256 _propertyId, uint256 _bidPrice);

    // Accept event
    event Accept(
        address indexed _seller,
        uint256 _propertyId,
        uint256 _bidPrice
    );
}