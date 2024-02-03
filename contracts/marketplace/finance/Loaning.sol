// contracts/Loaning.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../property/Property.sol";

contract LoaningContract is OwnableUpgradeable, PropertyContract {
    address[] public lenders; // list of lenders

    function __LoaningContract_init() internal {
        __Ownable_init();
        __PropertyContract_init();
    }

    // Add lender to lenders array
    function addLender(address _lender) external virtual {
        lenders.push(_lender);
    }

    // Remove lender from lenders array
    function removeLender(address _lender) external virtual {
        for (uint256 i = 0; i < lenders.length; i++) {
            if (lenders[i] == _lender) {
                delete lenders[i];
                break;
            }
        }
    }
}
