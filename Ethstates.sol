// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstate is ERC721, ERC721URIStorage, ERC721Burnable, ERC721Pausable, Ownable {

    uint256 public tokenCounter;
    string public baseTokenURI;

    struct Location {
        uint32 zipCode;
        string city;
        string state;
    }

    struct PropertyFeatures {
        uint256 squareFootage;
        uint256 bedrooms;
        uint256 bathrooms;
        string parking;
        string additionalFeatures;
    }

    struct RealEstateInfo {
        address owner;
        Location location;
        PropertyFeatures features;
        uint256 price;
        string contactDetails;
        string[] images;
        // string notes;
        // uint256 apn;
        // bool forSale;
    }

    RealEstateInfo[] public realEstates;

    constructor(string memory _baseTokenURI, address initialOwner) ERC721("RealEstate", "RE") Ownable(initialOwner) {
        baseTokenURI = _baseTokenURI;
        tokenCounter = 0;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = tokenCounter++;
        _safeMint(to, tokenId);
        string memory fullURI = string(abi.encodePacked(baseTokenURI, uri));
        _setTokenURI(tokenId, fullURI);
    }

    function mintRealEstate(
        uint32 _zipCode,
        string memory _city,
        string memory _state,
        uint256 _squareFootage,
        uint256 _bedrooms,
        uint256 _bathrooms,
        string memory _parking,
        string memory _additionalFeatures,
        uint256 _price,
        string memory _contactDetails,
        string[] memory _images
        // string memory _notes,
        // uint256 _apn,
        // bool _forSale
    ) external onlyOwner {
        RealEstateInfo memory newRealEstate = RealEstateInfo({
            owner: msg.sender,
            location: Location(_zipCode,_city, _state),
            features: PropertyFeatures(_squareFootage, _bedrooms, _bathrooms, _parking, _additionalFeatures),
            price: _price,
            contactDetails: _contactDetails,
            images: _images
            // notes: _notes,
            // apn: _apn,
            // forSale: _forSale
        });

        realEstates.push(newRealEstate);
        uint256 tokenId = realEstates.length - 1;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, "");
    }





    function updateBaseTokenURI(string memory newBaseTokenURI) external onlyOwner {
        baseTokenURI = newBaseTokenURI;
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }
}
