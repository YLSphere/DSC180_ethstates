// contracts/Marketplace.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Property.sol";

contract MarketplaceContract is PropertyContract {
    struct Bid {
        address buyer;
        uint256 bidPrice;
    }

    struct Listing {
        // Sale
        uint256 propertyId;
        uint256 sellPrice;
        bool buyerApproved;
        bool sellerApproved;
        // Bidding
        Bid[] bids;
        Bid acceptedBid;
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

    function __MarketplaceContract_init() internal {
        __PropertyContract_init();
        listingCount = 0;
    }

    // Listing addition event
    event List(
        address indexed _seller,
        uint256 _propertyId,
        uint256 _sellPrice
    );

    // Listing removal event
    event Unlist(address indexed _seller, uint256 _propertyId);

    // Offer event
    event Offer(address indexed _buyer, uint256 _propertyId, uint256 _bidPrice);

    // Accept event
    event Accept(
        address indexed _seller,
        uint256 _propertyId,
        uint256 _bidPrice
    );

    // Function to list a property for sale
    function listProperty(
        uint256 _propertyId,
        uint256 _sellPrice
    ) external propertyExists(_propertyId) isPropertyOwner(_propertyId) {
        require(_exists(_propertyId), "Property with this ID does not exist");
        require(_sellPrice > 0, "Sell price cannot be zero");
        require(
            listings[_propertyId].propertyId != _propertyId,
            "Property is already listed"
        );

        listingCount++;

        Listing storage listing = listings[_propertyId];
        listing.propertyId = _propertyId;
        listing.sellPrice = _sellPrice;

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
            Bid({buyer: _msgSender(), bidPrice: _bidPrice})
        );

        emit Offer(_msgSender(), _propertyId, _bidPrice);
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

        listings[_propertyId].sellerApproved = true;

        // Find the bid and set it as accepted bid
        for (uint256 i = 0; i < listings[_propertyId].bids.length; i++) {
            if (listings[_propertyId].bids[i].buyer == _buyer) {
                listings[_propertyId].acceptedBid = listings[_propertyId].bids[
                    i
                ];
                break;
            }
        }

        emit Accept(
            _msgSender(),
            _propertyId,
            listings[_propertyId].acceptedBid.bidPrice
        );
    }

    function transfer(
        uint256 _propertyId
    ) internal propertyExists(_propertyId) {
        require(
            listings[_propertyId].buyerApproved &&
                listings[_propertyId].sellerApproved,
            "Transfer not approved by both parties"
        );
        address buyer = listings[_propertyId].acceptedBid.buyer;
        address seller = ownerOf(_propertyId);
        uint256 bidPrice = listings[_propertyId].acceptedBid.bidPrice;

        payable(seller).transfer(listings[_propertyId].acceptedBid.bidPrice); // transfer cost to seller
        _transfer(seller, buyer, _propertyId); // transfer property nft to buyer
        require(ownerOf(_propertyId) == buyer, "Transfer failed");

        delete listings[_propertyId]; // remove from sale

        emit Transfer(seller, buyer, _propertyId, bidPrice);
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
