// contracts/PropertyV2.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract PropertyV2 is
    Initializable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    struct Property {
        // location and feature
        uint256 cost;
        uint256 propertyId;
        // for sale attributes
        address buyer;
        bool wantSell;
        bool buyerApproved;
        bool sellerApproved;
    }

    uint256 public propertyCount; // total number of properties via this contract

    mapping(uint256 => Property) public properties; // mapping of propertyId to Property struct

    IERC20 internal usdc; // USDC token

    function initialize() public initializer {
        __ERC721_init("Property", "PROP");
        __Ownable_init();
        propertyCount = 0;
        usdc = IERC20(address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48));
    }

    // Property addition event
    event Add(address indexed _owner, uint256 _propertyId);

    // Property removal event
    event Remove(address indexed _owner, uint256 _propertyId);

    // Property listing event
    event List(address indexed _owner, uint256 _propertyId);

    // Property transfer event
    event Transfer(
        address indexed _seller,
        address indexed _buyer,
        uint256 _propertyId,
        uint256 _sellPrice
    );

    // Modifier to check if the caller is the owner of a specific property
    modifier isPropertyOwner(uint256 _propertyId) {
        require(_exists(_propertyId), "Property with this ID does not exist");
        require(
            ownerOf(_propertyId) == msg.sender,
            "Caller is not the owner of this property"
        );
        _;
    }

    // Modifier to check if the caller is the agreed approver for a specific property transfer
    modifier isAgreedBuyer(uint256 _propertyId) {
        require(_exists(_propertyId), "Property with this ID does not exist");
        require(
            properties[_propertyId].buyer == msg.sender,
            "Caller is not the agreed approver for this property transfer"
        );
        require(
            properties[_propertyId].buyerApproved &&
                properties[_propertyId].sellerApproved,
            "Approval haven't given"
        );
        require(
            properties[_propertyId].wantSell,
            "Property is not available for sale"
        );
        require(
            properties[_propertyId].cost <= msg.value,
            "Insufficient payment"
        );
        _;
    }

    // Owner shall add lands via this function
    function addProperty(
        address _owner,
        string memory _uri,
        uint256 _cost
    ) external onlyOwner {
        require(bytes(_uri).length > 0, "URI cannot be empty");
        require(_cost > 0, "Cost cannot be zero");
        propertyCount++;
        properties[propertyCount] = Property({
            cost: _cost,
            propertyId: propertyCount,
            buyer: address(0),
            wantSell: false,
            buyerApproved: false,
            sellerApproved: false
        });

        _safeMint(_owner, propertyCount);
        _setTokenURI(propertyCount, _uri);
        require(ownerOf(propertyCount) == _owner, "Owner not set");

        emit Add(_owner, propertyCount);
    }

    // Owner shall list lands for sale via this function
    function listPropertyForSale(
        uint256 _propertyId
    ) external isPropertyOwner(_propertyId) {
        require(
            properties[_propertyId].wantSell == false,
            "Property is already available for sale"
        );
        properties[_propertyId].wantSell = true;

        emit List(msg.sender, _propertyId);
    }

    // Owner shall cancel the sale via this function
    function cancelPropertySale(
        uint256 _propertyId
    ) external isPropertyOwner(_propertyId) {
        require(
            properties[_propertyId].wantSell == true,
            "Property is not available for sale"
        );
        require(
            properties[_propertyId].buyer == address(0),
            "Buyer already set"
        );
        properties[_propertyId].wantSell = false;
    }

    // Owner shall remove lands via this function
    function removeProperty(
        uint256 _propertyId
    ) external isPropertyOwner(_propertyId) {
        require(_exists(_propertyId), "Property with this ID does not exist");
        require(
            properties[_propertyId].wantSell == false,
            "Property is available for sale. Please cancel the sale first"
        );
        _burn(_propertyId);
        delete properties[_propertyId];

        emit Remove(msg.sender, _propertyId);
    }

    // Seller agree on the buyer before initiating the transfer process
    function agreeOnBuyer(
        uint _propertyId,
        address _buyer
    ) external isPropertyOwner(_propertyId) {
        require(
            properties[_propertyId].buyer == address(0),
            "Buyer already set"
        );
        properties[_propertyId].buyer = _buyer;
    }

    // Seller shall clear the agreed buyer via this function
    function clearAgreedBuyer(
        uint256 _propertyId
    ) external isPropertyOwner(_propertyId) {
        require(properties[_propertyId].buyer != address(0), "Buyer not set");
        require(
            properties[_propertyId].sellerApproved == false,
            "Transfer already approved by the seller"
        );
        require(
            properties[_propertyId].buyerApproved == false,
            "Transfer already approved by the buyer"
        );
        properties[_propertyId].buyer = address(0);
    }

    // Buyer approves the transfer
    function approveTransferAsBuyer(uint256 _propertyId) external {
        require(
            properties[_propertyId].buyer == msg.sender,
            "Caller is not the agreed approver for this land transfer"
        );
        require(
            properties[_propertyId].buyerApproved == false,
            "Transfer already approved by the buyer"
        );
        properties[_propertyId].buyerApproved = true;
        usdc.approve(ownerOf(_propertyId), properties[_propertyId].cost);

        checkAndCompleteTransfer(_propertyId);
    }

    // Seller approves the transfer
    function approveTransferAsSeller(
        uint256 _propertyId
    ) external isPropertyOwner(_propertyId) {
        require(
            properties[_propertyId].sellerApproved == false,
            "Transfer already approved by the seller"
        );
        properties[_propertyId].sellerApproved = true;

        checkAndCompleteTransfer(_propertyId);
    }

    // Function to check if both buyer and seller have approved the transfer
    // If approved, complete the transfer
    function checkAndCompleteTransfer(uint256 _propertyId) internal {
        if (
            properties[_propertyId].buyerApproved &&
            properties[_propertyId].sellerApproved
        ) {
            address buyer = properties[_propertyId].buyer;
            address seller = ownerOf(_propertyId);

            usdc.transferFrom(buyer, seller, properties[_propertyId].cost); // transfer cost to seller (USDC)
            _transfer(seller, buyer, _propertyId); // transfer property nft to buyer
            require(ownerOf(_propertyId) == buyer, "Transfer failed");

            properties[_propertyId].wantSell = false; // remove from sale
            properties[_propertyId].buyer = address(0); // reset buyer
            properties[_propertyId].buyerApproved = false; // reset buyer approval
            properties[_propertyId].sellerApproved = false; // reset seller approval

            emit Transfer(
                seller,
                buyer,
                _propertyId,
                properties[_propertyId].cost
            );
        }
    }
}
