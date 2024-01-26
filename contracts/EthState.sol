// contracts/EthState.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Marketplace.sol";

contract EthState is Initializable, OwnableUpgradeable, MarketplaceContract {
    function initialize() public initializer {
        __Ownable_init();
        __MarketplaceContract_init();
    }
}
