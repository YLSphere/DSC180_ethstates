// transaction/Listing.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "../property/Property.sol";
import "../finance/Financing.sol";
import "./Bidding.sol";

contract ListingContract is PropertyContract, FinancingContract {
    using Bidding for Bidding.Bid;
    using FinancingLibrary for FinancingLibrary.Financing;

    struct Listing {
        // Sale
        uint256 propertyId;
        uint256 sellPrice;
        bool buyerApproved;
        bool sellerApproved;
        // Financing
        FinancingLibrary.Financing currentFinancing;
        FinancingLibrary.Financing previousFinancing;
        // Bidding
        Bidding.Bid[] bids;
        Bidding.Bid acceptedBid;
        // TODO: Buy Out
    }

    uint256 public listingCount; // total number of listings via this contract

    mapping(uint256 => Listing) public listings; // mapping of propertyId to Listing struct

    modifier isListed(uint256 _propertyId) {
        require(
            listings[_propertyId].propertyId == _propertyId,
            "Property is not listed"
        );
        _;
    }

    // Check if buyer is the accepted buyer
    modifier isAcceptedBuyer(uint256 _propertyId, address _buyer) {
        require(
            listings[_propertyId].acceptedBid.buyer == _buyer,
            "Caller is not the approved buyer"
        );
        _;
    }

    modifier bidsIncludeBuyerOrNot(
        uint256 _propertyId,
        address _buyer,
        bool _include
    ) {
        bool found = false;
        for (uint256 i = 0; i < listings[_propertyId].bids.length; i++) {
            if (listings[_propertyId].bids[i].buyer == _buyer) {
                found = true;
                break;
            }
        }
        if (_include) {
            require(found, "Buyer not found in bids");
        } else {
            require(!found, "Buyer already bid on this property");
        }
        _;
    }

    // Listing addition event
    event List(
        address indexed _seller,
        uint256 _propertyId,
        uint256 _sellPrice
    );

    // Listing removal event
    event Unlist(address indexed _seller, uint256 _propertyId);

    function __ListingContract_init() internal {
        __PropertyContract_init();
        __FinancingContract_init();
        listingCount = 0;
    }

    // Function to list a property for sale
    function listProperty(
        uint256 _propertyId,
        uint256 _sellPrice
    ) external propertyExists(_propertyId) isPropertyOwner(_propertyId) {
        require(_exists(_propertyId), "Property with this ID does not exist");
        require(
            listings[_propertyId].propertyId != _propertyId,
            "Property is already listed"
        );
        require(_sellPrice > 0, "Sell price cannot be zero");
        require(
            remainingBalance(_propertyId) <= _sellPrice,
            "Sell price cannot be less than loan amount"
        );

        listingCount++;

        Listing storage listing = listings[_propertyId];
        listing.propertyId = _propertyId;
        listing.sellPrice = _sellPrice;
        listing.previousFinancing = financings[_propertyId];

        emit List(_msgSender(), _propertyId, _sellPrice);
    }

    // Function to unlist a property from sale
    function unlistProperty(
        uint256 _propertyId
    )
        external
        propertyExists(_propertyId)
        isPropertyOwner(_propertyId)
        isListed(_propertyId)
    {
        require(
            listings[_propertyId].buyerApproved == false &&
                listings[_propertyId].sellerApproved == false,
            "Property is under transfer"
        );

        listingCount--;
        delete listings[_propertyId];

        emit Unlist(_msgSender(), _propertyId);
    }

    // =========== Bidding functions ===========

    // Function to place a bid on a listing property
    function bid(
        uint256 _propertyId,
        uint256 _bidPrice
    )
        external
        propertyExists(_propertyId)
        isListed(_propertyId)
        bidsIncludeBuyerOrNot(_propertyId, _msgSender(), false)
    {
        require(_msgSender() != ownerOf(_propertyId), "Owner cannot bid");
        require(
            listings[_propertyId].acceptedBid.buyer == address(0) &&
                listings[_propertyId].acceptedBid.bidPrice == 0,
            "Bid already set"
        );

        listings[_propertyId].bids.push(
            Bidding.Bid({buyer: _msgSender(), bidPrice: _bidPrice})
        );

        emit Bidding.Offer(_msgSender(), _propertyId, _bidPrice);
    }

    // Function to accept a bid on a listing property
    function acceptOffer(
        uint256 _propertyId,
        address _buyer
    )
        external
        propertyExists(_propertyId)
        isPropertyOwner(_propertyId)
        isListed(_propertyId)
        bidsIncludeBuyerOrNot(_propertyId, _buyer, true)
    {
        require(
            listings[_propertyId].acceptedBid.buyer == address(0) &&
                listings[_propertyId].acceptedBid.bidPrice == 0,
            "Bid already set"
        );

        // Find the bid and set it as accepted bid
        for (uint256 i = 0; i < listings[_propertyId].bids.length; i++) {
            if (listings[_propertyId].bids[i].buyer == _buyer) {
                require( // TODO: Change loan amount to remaining balance
                    listings[_propertyId].previousFinancing.loanAmount <=
                        listings[_propertyId].bids[i].bidPrice,
                    "Bid price cannot be less than loan amount"
                );
                listings[_propertyId].acceptedBid = listings[_propertyId].bids[
                    i
                ];
                break;
            }
        }

        listings[_propertyId].sellerApproved = true;

        emit Bidding.Accept(
            _msgSender(),
            _propertyId,
            listings[_propertyId].acceptedBid.bidPrice
        );
    }

    // =========== Financing functions ===========

    // Function for buyer to request financing
    function financingRequest(
        uint256 _propertyId,
        address _lender,
        uint256 _loanAmount, // in wei
        uint256 _monthlyInterestRate, // in percentage
        uint256 _durationInMonths
    )
        external
        propertyExists(_propertyId)
        isListed(_propertyId)
        isAcceptedBuyer(_propertyId, _msgSender())
    {
        listings[_propertyId].currentFinancing = _financingRequest(
            _propertyId,
            _lender,
            _loanAmount,
            _monthlyInterestRate,
            _durationInMonths
        );
    }

    // Lender shall approve the financing request
    function approveCurrentFinancing(
        uint256 _propertyId
    ) external payable propertyExists(_propertyId) isListed(_propertyId) {
        FinancingLibrary.Financing storage financing = listings[_propertyId]
            .currentFinancing;
        require(
            financing.status == FinancingLibrary.FinancingStatus.Pending,
            "Financing not pending"
        );
        require(financing.lender == _msgSender(), "Caller is not the lender");
        require(msg.value >= financing.loanAmount, "Insufficient payment");

        financing.approve();

        emit FinanceApproval(
            _msgSender(),
            financing.loaner,
            financing.propertyId
        );
    }

    // Lender shall reject the financing request
    function rejectCurrentFinancing(uint256 _propertyId) external {
        FinancingLibrary.Financing storage financing = listings[_propertyId]
            .currentFinancing;
        require(financing.lender == _msgSender(), "Caller is not the lender");

        financing.reject();

        emit FinanceRejection(
            _msgSender(),
            financing.loaner,
            financing.propertyId
        );
    }

    // =========== Utility functions ===========

    // Function to get specific listing
    function getListing(
        uint256 _propertyId
    ) external view returns (Listing memory) {
        return listings[_propertyId];
    }

    // Function to get all active listings
    function getActiveListings() external view returns (Listing[] memory) {
        Listing[] memory activeListings = new Listing[](listingCount);
        uint256 activeListingCount = 0;
        for (uint256 i = 1; i <= propertyCount; i++) {
            if (listings[i].propertyId == i) {
                activeListings[activeListingCount] = listings[i];
                activeListingCount++;
            }
            if (activeListingCount == listingCount) {
                break;
            }
        }
        return activeListings;
    }
}
