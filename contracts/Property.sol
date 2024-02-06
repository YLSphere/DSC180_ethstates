// contracts/Property.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract PropertyContract is ERC721URIStorageUpgradeable {
    struct Property {
        // location and feature
        uint256 propertyId;
        string uri;
        uint256 price;
    }

    uint256 public propertyCount; // total number of properties via this contract

    mapping(uint256 => Property) public properties; // mapping of propertyId to Property struct

    function __PropertyContract_init() internal {
        __ERC721_init("Property", "PROP");
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

    // Modifier to check if the property exists
    modifier propertyExists(uint256 _propertyId) {
        require(_exists(_propertyId), "Property with this ID does not exist");
        _;
    }

    // Modifier to check if the caller is the owner of a specific property
    modifier isPropertyOwner(uint256 _propertyId) {
        require(
            ownerOf(_propertyId) == _msgSender(),
            "Caller is not the owner of this property"
        );
        _;
    }

    // Owner shall add lands via this function
    function addProperty(string memory _uri, uint256 _price) external {
        require(bytes(_uri).length > 0, "URI cannot be empty");
        propertyCount++;
        properties[propertyCount] = Property({
            propertyId: propertyCount,
            uri: _uri,
            price: _price
        });

        _safeMint(_msgSender(), propertyCount);
        _setTokenURI(propertyCount, _uri);
        require(ownerOf(propertyCount) == _msgSender(), "Owner not set");

        emit Add(_msgSender(), propertyCount);
    }

    // Owner shall remove lands via this function
    function removeProperty(
        uint256 _propertyId
    )
        external
        virtual
        propertyExists(_propertyId)
        isPropertyOwner(_propertyId)
    {
        require(_exists(_propertyId), "Property with this ID does not exist");
        _burn(_propertyId);
        delete properties[_propertyId];
        propertyCount--;

        emit Remove(_msgSender(), _propertyId);
    }

    // Function to transfer a property
    function transfer() internal virtual {
        revert("Not implemented");
    }

    // =========== Utility functions ===========
    
    // Function to get the property details by owner
    function getPropertiesByOwner(address _owner)
        external
        view
        returns (Property[] memory)
    {
        uint256 propertyListCount = 0;
        uint256 propertyCountByOwner = balanceOf(_owner);
        Property[] memory propertyList = new Property[](propertyCountByOwner);
        for (uint256 i = 1; i <= propertyCount; i++) {
            if (ownerOf(i) == _owner) {
                propertyList[propertyListCount] = properties[i];
                propertyListCount++;
            }
            if (propertyListCount == propertyCountByOwner) {
                break;
            }
        }
        return propertyList;
    }
}
