// contracts/Property.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract PropertyContract is ERC721URIStorageUpgradeable {
    struct Property {
        uint256 price;
    }

    struct PropertyResult {
        // Property details to be returned
        uint256 propertyId;
        uint256 price;
        string uri;
    }

    uint256 public propertyCount; // total number of properties via this contract
    mapping(uint256 => Property) public properties; // mapping of propertyId to Property struct

    function __PropertyContract_init() internal {
        __ERC721_init("Property", "PROP");
        propertyCount = 0;
    }

    event Add(address indexed _owner, uint256 _propertyId);
    event Remove(address indexed _owner, uint256 _propertyId);

    error PropertyNotExists();
    error NotPropertyOwner();

    // Modifier to check if the property exists
    modifier propertyExists(uint256 _propertyId) {
        if (!_exists(_propertyId)) {
            revert PropertyNotExists();
        }
        _;
    }

    // Modifier to check if the caller is the owner of a specific property
    modifier isPropertyOwner(uint256 _propertyId) {
        if (ownerOf(_propertyId) != _msgSender()) {
            revert NotPropertyOwner();
        }
        _;
    }

    // Owner shall add lands via this function
    function addProperty(string memory _uri, uint256 _price) external {
        require(bytes(_uri).length > 0, "URI cannot be empty");
        propertyCount++;
        properties[propertyCount] = Property(_price);

        _safeMint(_msgSender(), propertyCount);
        _setTokenURI(propertyCount, _uri);
        emit Add(_msgSender(), propertyCount);
    }

    // Owner shall remove lands via this function
    function removeProperty(
        uint256 _propertyId
    ) external propertyExists(_propertyId) isPropertyOwner(_propertyId) {
        require(_exists(_propertyId), "Property with this ID does not exist");
        _transfer(_msgSender(), address(this), _propertyId);

        emit Remove(_msgSender(), _propertyId);
    }

    // Owner shall update the price of the property
    function setPrice(
        uint256 _propertyId,
        uint256 _price
    ) external propertyExists(_propertyId) isPropertyOwner(_propertyId) {
        properties[_propertyId].price = _price;
    }

    // =========== Utility functions ===========

    // Function to get the property details by propertyId
    function getPropertyById(
        uint256 _propertyId
    ) external view returns (PropertyResult memory) {
        return
            PropertyResult(
                _propertyId,
                properties[_propertyId].price,
                tokenURI(_propertyId)
            );
    }

    // Function to get the property details by owner
    function getPropertiesByOwner(
        address _owner
    ) external view returns (PropertyResult[] memory) {
        uint256 propertyListCount = 0;
        uint256 propertyCountByOwner = balanceOf(_owner);
        PropertyResult[] memory propertyList = new PropertyResult[](
            propertyCountByOwner
        );
        for (uint256 i = 1; i <= propertyCount; i++) {
            if (ownerOf(i) == _owner) {
                propertyList[propertyListCount].propertyId = i;
                propertyList[propertyListCount].price = properties[i].price;
                propertyList[propertyListCount].uri = tokenURI(i);
                propertyListCount++;
            }
            if (propertyListCount == propertyCountByOwner) {
                break;
            }
        }
        return propertyList;
    }
}
