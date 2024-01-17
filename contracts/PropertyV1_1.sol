// contracts/PropertyV1.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract PropertyV1_1 is
    Initializable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    struct Property {
        // location and feature
        uint256 cost;
        uint256 propertyId;
        string uri;
        // for sale attributes
        address buyer;
        bool wantSell;
        bool buyerApproved;
        bool sellerApproved;
    }

    uint256 public propertyCount; // total number of properties via this contract

    mapping(uint256 => Property) public properties; // mapping of propertyId to Property struct

    function initialize() public initializer {
        __ERC721_init("Property", "PROP");
        __Ownable_init();
        propertyCount = 0;
    }

    // Property addition event
    event Add(address indexed _owner, uint256 _propertyId);

    // Property removal event
    event Remove(address indexed _owner, uint256 _propertyId);

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
    function addProperty(string memory _uri, uint256 _cost) external {
        require(bytes(_uri).length > 0, "URI cannot be empty");
        require(_cost > 0, "Cost cannot be zero");
        propertyCount++;
        properties[propertyCount] = Property({
            cost: _cost,
            propertyId: propertyCount,
            uri: _uri,
            buyer: address(0),
            wantSell: false,
            buyerApproved: false,
            sellerApproved: false
        });

        _safeMint(_msgSender(), propertyCount);
        _setTokenURI(propertyCount, _uri);
        require(ownerOf(propertyCount) == _msgSender(), "Owner not set");

        emit Add(_msgSender(), propertyCount);
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
    function approveTransferAsBuyer(uint256 _propertyId) external payable {
        require(_exists(_propertyId), "Property with this ID does not exist");
        require(
            msg.value >= properties[_propertyId].cost,
            "Insufficient payment"
        );
        require(
            properties[_propertyId].buyer == msg.sender,
            "Caller is not the agreed approver for this land transfer"
        );
        require(
            properties[_propertyId].buyerApproved == false,
            "Transfer already approved by the buyer"
        );
        properties[_propertyId].buyerApproved = true;
        payable(msg.sender).transfer(msg.value - properties[_propertyId].cost); // refund excess payment

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

            payable(seller).transfer(properties[_propertyId].cost); // transfer cost to seller
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

    // Function to get all the properties owned by a specific address
    function getPropertiesByOwner(
        address _owner
    ) external view returns (Property[] memory) {
        uint256 propertyCountByOwner = balanceOf(_owner);
        Property[] memory propertiesByOwner = new Property[](
            propertyCountByOwner
        );
        uint256 counter = 0;
        for (
            uint256 i = 1;
            i <= propertyCount && counter < propertyCountByOwner;
            i++
        ) {
            if (ownerOf(i) == _owner) {
                propertiesByOwner[counter] = properties[i];
                counter++;
            }
        }
        return propertiesByOwner;
    }

    // Function to get all the properties listed for sale
    function getPropertiesForSale() external view returns (Property[] memory) {
        uint256 propertyCountForSale = 0;
        for (uint256 i = 1; i <= propertyCount; i++) {
            if (properties[i].wantSell) {
                propertyCountForSale++;
            }
        }
        Property[] memory propertiesForSale = new Property[](
            propertyCountForSale
        );
        uint256 counter = 0;
        for (
            uint256 i = 1;
            i <= propertyCount && counter < propertyCountForSale;
            i++
        ) {
            if (properties[i].wantSell) {
                propertiesForSale[counter] = properties[i];
                counter++;
            }
        }
        return propertiesForSale;
    }

    // ============ Bank ============

    struct Mortgage {
        address loaner;
        uint256 propertyId;
        uint256 amount;
        uint256 monthlyInterestRate;
        uint256 durationInMonths;
        uint256 monthlyPayment;
        uint256 paidMonths;
    }

    mapping(uint256 => Mortgage) public mortgages; // mapping of propertyId to Mortgage struct

    // Modifier to ensure the property is mortgaged
    modifier isMortgaged(uint256 _propertyId) {
        require(
            mortgages[_propertyId].propertyId == _propertyId,
            "Property is not mortgaged"
        );
        _;
    }

    // Modifier to ensure the property is not mortgaged
    modifier isNotMortgaged(uint256 _propertyId) {
        require(
            mortgages[_propertyId].propertyId == 0,
            "Property is mortgaged"
        );
        _;
    }

    event Fund(address indexed _from, uint256 _amount);

    // Fund the bank
    receive() external payable {
        emit Fund(_msgSender(), msg.value);
    }

    // Bank shall lend money to the owner of the property
    function mortgageProperty(
        uint256 _propertyId,
        uint256 _amount,
        uint256 _monthlyInterestRate,
        uint256 _durationInMonths
    ) external isPropertyOwner(_propertyId) isNotMortgaged(_propertyId) {
        require(
            properties[_propertyId].wantSell == false,
            "Property is available for sale. Please cancel the sale first"
        );
        require(
            properties[_propertyId].buyer == address(0),
            "Buyer already set"
        );
        require(
            properties[_propertyId].buyerApproved == false,
            "Transfer already approved by the buyer"
        );
        require(
            properties[_propertyId].sellerApproved == false,
            "Transfer already approved by the seller"
        );

        payable(_msgSender()).transfer(_amount); // transfer money to owner
        _transfer(_msgSender(), address(this), _propertyId); // transfer property nft to contract
        require(ownerOf(_propertyId) == address(this), "Transfer failed");
        _approve(_msgSender(), _propertyId); // approve loaner to sell property nft

        mortgages[_propertyId] = Mortgage({
            loaner: _msgSender(),
            propertyId: _propertyId,
            amount: _amount,
            monthlyInterestRate: _monthlyInterestRate,
            durationInMonths: _durationInMonths,
            monthlyPayment: _amount *
                ((_monthlyInterestRate *
                    (1 + _monthlyInterestRate) ** _durationInMonths) /
                    ((1 + _monthlyInterestRate) ** _durationInMonths - 1)),
            paidMonths: 0
        });
    }

    // Loaner shall pay monthly mortgage payment via this function
    function makeMortgagePayment(
        uint256 _propertyId
    ) external payable isMortgaged(_propertyId) {
        require(_msgSender() == mortgages[_propertyId].loaner, "Not loaner");
        require(
            msg.value >= mortgages[_propertyId].monthlyPayment,
            "Insufficient payment"
        );
        require(
            mortgages[_propertyId].paidMonths <
                mortgages[_propertyId].durationInMonths,
            "Mortgage already paid"
        );
        mortgages[_propertyId].paidMonths++;
        payable(mortgages[_propertyId].loaner).transfer(
            msg.value - mortgages[_propertyId].monthlyPayment
        ); // refund excess payment

        if (
            mortgages[_propertyId].paidMonths ==
            mortgages[_propertyId].durationInMonths
        ) {
            // if mortgage is paid
            _transfer(address(this), _msgSender(), _propertyId); // transfer property nft to owner
            require(ownerOf(_propertyId) == _msgSender(), "Transfer failed");
            delete mortgages[_propertyId];
        }
    }
}
