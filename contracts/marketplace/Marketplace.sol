// transaction/Marketplace.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./transaction/Listing.sol";

contract MarketplaceContract is ListingContract {
    function __MarketplaceContract_init() internal {
        __ListingContract_init();
    }

    // Function to transfer the property to the buyer
    function transfer(
        uint256 _propertyId
    ) internal propertyExists(_propertyId) {
        require(
            listings[_propertyId].buyerApproved &&
                listings[_propertyId].sellerApproved,
            "Transfer not approved by both parties"
        );
        require(
            listings[_propertyId].currentFinancing.status !=
                FinancingLibrary.FinancingStatus.Rejected,
            "Financing not approved"
        );

        address buyer = listings[_propertyId].acceptedBid.buyer;
        address seller = ownerOf(_propertyId);
        uint256 bidPrice = listings[_propertyId].acceptedBid.bidPrice;

        if (
            listings[_propertyId].previousFinancing.status ==
            FinancingLibrary.FinancingStatus.Active
        ) {
            // if property is financed
            uint256 toLender = remainingBalance(_propertyId);
            uint256 toSeller = bidPrice - toLender;

            payable(financings[_propertyId].lender).transfer(toLender); // transfer remaining loan to lender
            payable(seller).transfer(toSeller); // transfer remaining balance to seller

            payOffFinancing(_propertyId); // pay off financing
        } else {
            payable(seller).transfer(
                listings[_propertyId].acceptedBid.bidPrice
            ); // transfer cost to seller
        }

        _transfer(seller, buyer, _propertyId); // transfer property nft to buyer
        financings[_propertyId] = listings[_propertyId].currentFinancing; // update financing

        delete listings[_propertyId]; // remove from sale

        emit Transfer(seller, buyer, _propertyId, bidPrice);
    }

    // Seller approves the transfer
    function approveTransferAsSeller(
        uint256 _propertyId
    ) external propertyExists(_propertyId) isListed(_propertyId) {
        require(
            _msgSender() == ownerOf(_propertyId),
            "Caller is not the owner of this property"
        );
        require(
            listings[_propertyId].sellerApproved == false,
            "Transfer already approved by the seller"
        );

        listings[_propertyId].sellerApproved = true;

        transfer(_propertyId);
    }

    // Buyer approves the transfer
    function approveTransferAsBuyer(
        uint256 _propertyId
    ) external payable propertyExists(_propertyId) isListed(_propertyId) {
        require(
            listings[_propertyId].acceptedBid.buyer == _msgSender(),
            "Caller is not the buyer of this property"
        );
        require(
            msg.value >= listings[_propertyId].acceptedBid.bidPrice,
            "Insufficient payment"
        );
        require(
            listings[_propertyId].buyerApproved == false,
            "Transfer already approved by the buyer"
        );

        listings[_propertyId].buyerApproved = true;

        payable(_msgSender()).transfer(
            msg.value - listings[_propertyId].acceptedBid.bidPrice
        ); // refund excess payment

        transfer(_propertyId);
    }
}