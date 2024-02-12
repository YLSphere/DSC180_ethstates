// contracts/Marketplace.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./Property.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

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

    // BuyOut event
    event BuyOut(
        address indexed _buyer,
        uint256 _propertyId,
        uint256 _buyOutPrice
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
        listing.sellPrice = properties[_propertyId].price;

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
        delete listings[_propertyId].bids;

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
        delete listings[_propertyId].bids;

        emit Accept(
            _msgSender(),
            _propertyId,
            listings[_propertyId].acceptedBid.bidPrice
        );
        
    }

    // Function for buyer or seller to remove bid
    function removeBid(
        uint256 _propertyId,
        address _buyer
        ) external
        propertyExists(_propertyId)
        isListed(_propertyId)
        bidsIncludeBuyerOrNot(_propertyId, _buyer, true)
    {
        for (uint256 i = 0; i < listings[_propertyId].bids.length; i++) {
            if (listings[_propertyId].bids[i].buyer == _buyer) {
                // Swap with the last element and then pop
                listings[_propertyId].bids[i] = listings[_propertyId].bids[listings[_propertyId].bids.length - 1];
                listings[_propertyId].bids.pop();
                break;
            }
        }
    }


    //NEEDS CHANGING
    function changePrice(
        uint256 _propertyId,
        uint256 _newPrice
    ) external
    propertyExists(_propertyId) {
        require(
            listings[_propertyId].buyerApproved == false &&
                listings[_propertyId].sellerApproved == false,
            "Property is under transfer, prices cannot be changed"
        );
        require(
            _msgSender() == ownerOf(_propertyId),
            "Caller is not the owner of this property"
        );
        properties[_propertyId].price = _newPrice;
    }

    // Function for buyer or seller to end Bidding process before both parties approve
    function endBiddingProcess(
        uint256 _propertyId
    ) external
        propertyExists(_propertyId)
        isListed(_propertyId)
    {
        listings[_propertyId].sellerApproved = false;
        listings[_propertyId].buyerApproved = false;
        delete listings[_propertyId].acceptedBid;
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
        address buyer = listings[_propertyId].acceptedBid.buyer;
        address seller = ownerOf(_propertyId);
        uint256 bidPrice = listings[_propertyId].acceptedBid.bidPrice;

        payable(seller).transfer(listings[_propertyId].acceptedBid.bidPrice); // transfer cost to seller
        _transfer(seller, buyer, _propertyId); // transfer property nft to buyer
        require(ownerOf(_propertyId) == buyer, "Transfer failed");

        delete listings[_propertyId]; // remove from sale
        listingCount--;

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
        uint256 price = listings[_propertyId].acceptedBid.bidPrice * 1 ether;
        require(
            listings[_propertyId].acceptedBid.buyer == _msgSender(),
            "Caller is not the buyer of this property"
        );
        require(
            msg.value >= price,
            "Insufficient payment"
        );
        require(
            listings[_propertyId].buyerApproved == false,
            "Transfer already approved by the buyer"
        );
        
        listings[_propertyId].buyerApproved = true;
        payable(_msgSender()).transfer(
        
            msg.value - price
        ); // refund excess payment

        transfer(_propertyId);
    }

    // Function to buy out a property
    function buyOut(
        uint256 _propertyId
    ) external payable propertyExists(_propertyId) isListed(_propertyId) {
        
        require(
            listings[_propertyId].acceptedBid.buyer == address(0) &&
                listings[_propertyId].acceptedBid.bidPrice == 0,
            "Bid already set"
        );
        require(
            msg.value >= listings[_propertyId].sellPrice,
            "Insufficient payment for buy out"
        );

        listings[_propertyId].buyerApproved = true;

        listings[_propertyId].acceptedBid = Bid({
            buyer: _msgSender(),
            bidPrice: listings[_propertyId].sellPrice
        });

        payable(_msgSender()).transfer(
            msg.value - listings[_propertyId].sellPrice
        ); // refund excess payment

        emit BuyOut(_msgSender(), _propertyId, listings[_propertyId].sellPrice);
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