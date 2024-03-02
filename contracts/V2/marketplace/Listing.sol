// transaction/Listing.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Property.sol";
import "../interfaces/IFinancing.sol";

contract ListingContract is
    Initializable,
    OwnableUpgradeable,
    PropertyContract
{
    struct Bid {
        address buyer;
        uint256 bidPrice;
    }

    struct AcceptedBid {
        address buyer;
        uint256 bidPrice;
        uint256 financingId;
    }

    struct Listing {
        // Sale
        uint256 propertyId;
        uint256 sellPrice;
        bool buyerApproved;
        bool sellerApproved;
        // Financing
        uint256 financingId;
        // Bidding
        Bid[] bids;
        AcceptedBid acceptedBid;
    }

    uint256 public listingCount; // total number of listings via this contract
    mapping(uint256 => Listing) public listings; // mapping of propertyId to Listing struct
    IFinancing public financingContract; // Financing contract

    modifier listedOrNot(uint256 _propertyId, bool _listed) {
        bool isListed = listings[_propertyId].propertyId == _propertyId;
        if (_listed && !isListed) {
            revert PropertyNotListed();
        }
        if (!_listed && isListed) {
            revert PropertyAlreadyListed();
        }
        _;
    }

    modifier isAcceptedBuyer(uint256 _propertyId, address _buyer) {
        if (listings[_propertyId].acceptedBid.buyer != _buyer) {
            revert NotAcceptedBuyer();
        }
        _;
    }

    modifier bidSetOrNot(uint256 _propertyId, bool _set) {
        if (_set && listings[_propertyId].acceptedBid.buyer == address(0)) {
            revert BidNotSet();
        }
        if (!_set && listings[_propertyId].acceptedBid.buyer != address(0)) {
            revert BidAlreadySet();
        }
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
        if (_include && !found) {
            revert BuyerDidNotBid();
        }
        if (!_include && found) {
            revert BuyerAlreadyBid();
        }
        _;
    }

    modifier priceGreaterThanRequired(uint256 _propertyId) {
        uint256 _price = properties[_propertyId].price;
        if (
            _price == 0 ||
            _price < financingContract.remainingBalance(_propertyId)
        ) {
            revert PriceNotMet();
        }
        _;
    }

    modifier bothPartiesApproved(uint256 _propertyId) {
        if (
            !listings[_propertyId].buyerApproved ||
            !listings[_propertyId].sellerApproved
        ) {
            revert NotApprovedByBothParties();
        }
        _;
    }

    event List(uint256 _propertyId);
    event Unlist(uint256 _propertyId);
    event Offer(uint256 _propertyId);
    event Accept(uint256 _propertyId);

    error PropertyNotListed();
    error PropertyAlreadyListed();
    error NotAcceptedBuyer();
    error BuyerDidNotBid();
    error BuyerAlreadyBid();
    error BuyerAlreadyApproved();
    error BidNotSet();
    error BidAlreadySet();
    error PriceNotMet();
    error NotApprovedByBothParties();

    function initialize(address _financingContract) external initializer {
        __Ownable_init();
        __PropertyContract_init();
        listingCount = 0;
        financingContract = IFinancing(_financingContract);
    }

    // Function to list a property for sale
    function listProperty(
        uint256 _propertyId
    )
        external
        propertyExists(_propertyId)
        isPropertyOwner(_propertyId)
        listedOrNot(_propertyId, false)
        priceGreaterThanRequired(_propertyId)
    {
        listingCount++;

        Listing storage listing = listings[_propertyId];
        listing.propertyId = _propertyId;
        listing.sellPrice = properties[_propertyId].price;
        listing.financingId = financingContract.getFinancingId(_propertyId);
        emit List(_propertyId);
    }

    // Function to unlist a property from sale
    function unlistProperty(
        uint256 _propertyId
    )
        external
        propertyExists(_propertyId)
        isPropertyOwner(_propertyId)
        listedOrNot(_propertyId, true)
    {
        require(
            listings[_propertyId].buyerApproved == false &&
                listings[_propertyId].sellerApproved == false,
            "Property is under transfer"
        );

        listingCount--;
        delete listings[_propertyId];

        emit Unlist(_propertyId);
    }

    // =========== Bidding functions ===========

    // Function to place a bid on a listing property
    function bid(
        uint256 _propertyId,
        uint256 _bidPrice
    )
        external
        propertyExists(_propertyId)
        listedOrNot(_propertyId, true)
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

        emit Offer(_propertyId);
    }

    // Functon to unbid on a listing property
    function unbid(
        uint256 _propertyId
    )
        external
        propertyExists(_propertyId)
        listedOrNot(_propertyId, true)
        bidsIncludeBuyerOrNot(_propertyId, _msgSender(), true)
        bidSetOrNot(_propertyId, false)
    {
        uint256 bidIndex;
        for (uint256 i = 0; i < listings[_propertyId].bids.length; i++) {
            if (listings[_propertyId].bids[i].buyer == _msgSender()) {
                bidIndex = i;
                break;
            }
        }

        for (uint256 i = bidIndex; i < listings[_propertyId].bids.length - 1; i++) {
            listings[_propertyId].bids[i] = listings[_propertyId].bids[i + 1];
        }
        listings[_propertyId].bids.pop();
    }

    // Function to accept a bid on a listing property
    function acceptOffer(
        uint256 _propertyId,
        address _buyer
    )
        external
        propertyExists(_propertyId)
        isPropertyOwner(_propertyId)
        listedOrNot(_propertyId, true)
        bidSetOrNot(_propertyId, false)
    {
        // Find the bid and set it as accepted bid
        for (uint256 i = 0; i < listings[_propertyId].bids.length; i++) {
            if (listings[_propertyId].bids[i].buyer == _buyer) {
                IFinancing.Financing memory financing = financingContract
                    .getFinancing(listings[_propertyId].financingId);
                if (
                    // TODO: Change loan amount to remaining balance
                    financing.loanAmount >
                    listings[_propertyId].bids[i].bidPrice
                ) {
                    revert PriceNotMet();
                }
                listings[_propertyId].acceptedBid = AcceptedBid({
                    buyer: _buyer,
                    bidPrice: listings[_propertyId].bids[i].bidPrice,
                    financingId: 0
                });

                listings[_propertyId].sellerApproved = true;
                emit Accept(_propertyId);
                return;
            }
        }

        revert BuyerDidNotBid();
    }

    // =========== Accepted bid financing functions ===========

    // Function to start financing for the accepted bid
    function requestFinancing(
        uint256 _loanId,
        uint256 _propertyId,
        uint256 _loanAmount, // in wei
        uint256 _durationInMonths
    )
        external
        propertyExists(_propertyId)
        listedOrNot(_propertyId, true)
        isAcceptedBuyer(_propertyId, _msgSender())
    {
        uint256 financingId = financingContract.financingRequest(
            _loanId,
            _propertyId,
            _loanAmount,
            _durationInMonths
        );
        listings[_propertyId].acceptedBid.financingId = financingId;
    }

    // =========== Transfer functions ===========

    // Function to transfer the property to the buyer
    function transfer(
        uint256 _propertyId
    ) internal propertyExists(_propertyId) bothPartiesApproved(_propertyId) {
        address buyer = listings[_propertyId].acceptedBid.buyer;
        address seller = ownerOf(_propertyId);
        uint256 bidPrice = listings[_propertyId].acceptedBid.bidPrice;
        IFinancing.Financing memory financing = financingContract.getFinancing(
            _propertyId
        );

        if (financing.status == IFinancing.FinancingStatus.Active) {
            // if property is financed
            uint256 toLender = financingContract.remainingBalance(_propertyId);
            uint256 toSeller = bidPrice - toLender;
            address lender = financingContract.getLoan(financing.loanId).lender;

            payable(lender).transfer(toLender); // transfer remaining loan to lender
            payable(seller).transfer(toSeller); // transfer remaining balance to seller

            financingContract.payOffFinancing(_propertyId); // pay off financing
        } else {
            payable(seller).transfer(
                listings[_propertyId].acceptedBid.bidPrice
            ); // transfer cost to seller
        }

        _transfer(seller, buyer, _propertyId); // transfer property nft to buyer
        financingContract.setFinancingId(
            _propertyId,
            listings[_propertyId].financingId
        ); // update financing

        delete listings[_propertyId]; // remove from sale
        listingCount--;
        emit Transfer(seller, buyer, _propertyId);
    }

    // Seller approves the transfer
    function approveTransferAsSeller(
        uint256 _propertyId
    )
        external
        propertyExists(_propertyId)
        isPropertyOwner(_propertyId)
        listedOrNot(_propertyId, true)
    {
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
    )
        external
        payable
        propertyExists(_propertyId)
        listedOrNot(_propertyId, true)
        isAcceptedBuyer(_propertyId, _msgSender())
    {
        if (msg.value < listings[_propertyId].acceptedBid.bidPrice) {
            revert PriceNotMet();
        }
        if (listings[_propertyId].buyerApproved) {
            revert BuyerAlreadyApproved();
        }

        listings[_propertyId].buyerApproved = true;
        payable(_msgSender()).transfer(
            msg.value - listings[_propertyId].acceptedBid.bidPrice
        ); // refund excess payment
        transfer(_propertyId);
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
