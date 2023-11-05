// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstate is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, ERC721Pausable, Ownable {
    uint256 public tokenCounter;
    string public baseTokenURI;

    struct RealEstateInfo {
        address owner;
        string zipCode;
        string city;
        string state;
        uint256 squareFootage;
        uint256 bedrooms;
        uint256 bathrooms;
        string parking;
        string additionalFeatures;
        uint256 price;
        string contactDetails;
        string[] images;
        string notes;
        uint256 apn;
    }

    mapping(uint256 => RealEstateInfo) public realEstates;

    constructor(string memory _baseTokenURI) ERC721("RealEstate", "RE") {
        baseTokenURI = _baseTokenURI;
        tokenCounter = 0;
    }

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = tokenCounter++;
        _safeMint(to, tokenId);
        string memory fullURI = string(abi.encodePacked(baseTokenURI, uri));
        _setTokenURI(tokenId, fullURI);
}

    function mintRealEstate(
        string memory _zipCode,
        string memory _city,
        string memory _state,
        uint256 _squareFootage,
        uint256 _bedrooms,
        uint256 _bathrooms,
        string memory _parking,
        string memory _additionalFeatures,
        uint256 _price,
        string memory _contactDetails,
        string[] memory _images,
        string memory _notes,
        uint256 _apn
    ) 
    external onlyOwner {
        uint256 tokenId = tokenCounter;
        RealEstateInfo memory newRealEstate = RealEstateInfo({
            owner: msg.sender,
            zipCode: _zipCode,
            city: _city,
            state: _state,
            squareFootage: _squareFootage,
            bedrooms: _bedrooms,
            bathrooms: _bathrooms,
            parking: _parking,
            additionalFeatures: _additionalFeatures,
            price: _price,
            contactDetails: _contactDetails,
            images: _images,
            notes: _notes,
            apn: _apn
        });

        realEstates[tokenId] = newRealEstate;
        tokenCounter++;
    }

    function updateBaseTokenURI(string memory newBaseTokenURI) external onlyOwner {
        baseTokenURI = newBaseTokenURI;
    }
}
