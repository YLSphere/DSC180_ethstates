// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

interface IListing {
    // =========== Property ===========

    struct Property {
        uint256 price;
    }

    struct PropertyResult {
        // Property details to be returned
        uint256 propertyId;
        uint256 price;
        string uri;
    }

    event Add(address indexed _owner, uint256 _propertyId);
    event Remove(address indexed _owner, uint256 _propertyId);

    error PropertyNotExists();
    error NotPropertyOwner();

    // Owner shall add lands via this function
    function addProperty(string memory _uri, uint256 _price) external;

    // Owner shall remove lands via this function
    function removeProperty(uint256 _propertyId) external;

    // Function to get the property details by owner
    function getPropertiesByOwner(
        address _owner
    ) external view returns (PropertyResult[] memory);

    // =========== Listing ===========

    struct Bid {
        address buyer;
        uint256 bidPrice;
    }

    struct Listing {
        uint256 propertyId;
        uint256 sellPrice;
        bool buyerApproved;
        bool sellerApproved;
        uint256 financingId;
        Bid[] bids;
        Bid acceptedBid;
    }

    // Events
    event List(
        address indexed _seller,
        uint256 _propertyId,
        uint256 _sellPrice
    );
    event Unlist(address indexed _seller, uint256 _propertyId);
    event Offer(address indexed _buyer, uint256 _propertyId, uint256 _bidPrice);
    event Accept(
        address indexed _seller,
        uint256 _propertyId,
        uint256 _bidPrice
    );

    // Errors
    error PropertyNotListed();
    error PropertyAlreadyListed();
    error NotAcceptedBuyer();
    error BuyerDidNotBid();
    error BuyerAlreadyBid();
    error BidNotSet();
    error BidAlreadySet();
    error PriceNotMet();
    error NotApprovedByBothParties();

    // Function to list a property for sale
    function listProperty(uint256 _propertyId, uint256 _sellPrice) external;

    // Function to unlist a property from sale
    function unlistProperty(uint256 _propertyId) external;

    // Function to place a bid on a listing property
    function bid(uint256 _propertyId, uint256 _bidPrice) external;

    // Function to accept a bid on a listing property
    function acceptOffer(uint256 _propertyId, address _buyer) external;

    // Seller approves the transfer
    function approveTransferAsSeller(uint256 _propertyId) external;

    // Buyer approves the transfer
    function approveTransferAsBuyer(uint256 _propertyId) external payable;

    // Function to get specific listing
    function getListing(
        uint256 _propertyId
    ) external view returns (Listing memory);

    // Function to get all active listings
    function getActiveListings() external view returns (Listing[] memory);
}
