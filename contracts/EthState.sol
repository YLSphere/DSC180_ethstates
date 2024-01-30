// contracts/EthState.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Financing.sol";
import "./Marketplace.sol";

contract EthState is
    Initializable,
    OwnableUpgradeable,
    MarketplaceContract,
    FinancingContract
{
    function initialize() public initializer {
        __Ownable_init();
        __FinancingContract_init();
        __MarketplaceContract_init();
    }
}
