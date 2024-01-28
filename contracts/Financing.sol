// contracts/Financing.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Property.sol";

contract FinancingContract is OwnableUpgradeable, PropertyContract {
    enum FinancingStatus {
        None,
        Pending,
        Rejected,
        Active,
        Default,
        PaidOff
    }

    struct Financing {
        uint256 propertyId;
        address lender;
        FinancingStatus status;
        // Financing details
        uint256 loanAmount;
        uint256 monthlyInterestRate;
        uint256 durationInMonths;
        uint256 monthlyPayment;
        uint256 paidMonths;
    }

    address[] public lenders; // list of lenders

    mapping(uint256 => Financing[]) public financings; // mapping of propertyId to Financing struct

    function __FinancingContract_init() internal {
        __Ownable_init();
        __PropertyContract_init();
    }

    // Finance event
    event FinanceRequest(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId,
        uint256 _financingId
    );

    // Finance approval event
    event FinanceApproval(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId,
        uint256 financingId
    );

    // Finance rejection event
    event FinanceRejection(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId,
        uint256 _financingId
    );

    // Payment event
    event Payment(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId,
        uint256 _financingId,
        uint256 _paidMonths,
        uint256 _monthlyPayment
    );

    // Default event
    event Default(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId,
        uint256 _financingId
    );

    // Paid off event
    event PaidOff(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId,
        uint256 _financingId
    );

    // Modifier to check if the property is currently being financed twice
    modifier isCurrentlyFinanced(uint256 _propertyId) {
        bool found = false;
        for (uint256 i = 0; i < financings[_propertyId].length; i++) {
            if (financings[_propertyId][i].status == FinancingStatus.Active) {
                found = true;
                break;
            }
        }
        require(!found, "Property already being financed");
        _;
    }

    // Modifier to check if financing exists
    modifier financingExists(uint256 _propertyId, uint256 _financingId) {
        require(
            financings[_propertyId].length > 0,
            "No financing request for this property"
        );
        require(
            financings[_propertyId][_financingId].status ==
                FinancingStatus.Pending,
            "Financing request not pending"
        );
        _;
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

    // Lenders shall lend money to the owner of the property
    function financingRequest(
        uint256 _propertyId,
        address _lender,
        uint256 _loanAmount, // in wei
        uint256 _monthlyInterestRate, // in percentage
        uint256 _durationInMonths
    )
        external
        isPropertyOwner(_propertyId) // Only owner can mortgage
        isCurrentlyFinanced(_propertyId) // Property cannot have active financing
    {
        address loaner = _msgSender(); // loaner is the caller
        uint256 _financingId = financings[_propertyId].length; // financingId is the length of financings array
        uint256 _monthlyPayment = _loanAmount *
            ((_monthlyInterestRate *
                (1 + _monthlyInterestRate) ** _durationInMonths) /
                ((1 + _monthlyInterestRate) ** _durationInMonths - 1));

        payable(loaner).transfer(_loanAmount); // transfer money to owner
        _approve(_lender, _propertyId); // approve loaner to sell property nft

        // Add financing to financings mapping
        financings[_propertyId].push(
            Financing({
                propertyId: _propertyId,
                lender: _lender,
                status: FinancingStatus.Pending,
                loanAmount: _loanAmount,
                monthlyInterestRate: _monthlyInterestRate,
                durationInMonths: _durationInMonths,
                monthlyPayment: _monthlyPayment,
                paidMonths: 0
            })
        );

        emit FinanceRequest(_lender, loaner, _propertyId, _financingId);
    }

    // Lender shall approve the financing request
    function approveFinancing(
        uint256 _propertyId,
        uint256 _financingId
    ) external financingExists(_propertyId, _financingId) {
        require(
            financings[_propertyId].length > 0,
            "No financing request for this property"
        );
        require(
            financings[_propertyId][_financingId].status ==
                FinancingStatus.Pending,
            "Financing request already approved or rejected"
        );
        require(
            financings[_propertyId][_financingId].lender == _msgSender(),
            "Caller is not the lender"
        );

        financings[_propertyId][_financingId].status = FinancingStatus.Active;

        emit FinanceApproval(
            _msgSender(),
            _ownerOf(_propertyId),
            _propertyId,
            _financingId
        );
    }

    // Lender shall reject the financing request
    function rejectFinancing(
        uint256 _propertyId,
        uint256 _financingId
    ) external financingExists(_propertyId, _financingId) {
        require(
            financings[_propertyId].length > 0,
            "No financing request for this property"
        );
        require(
            financings[_propertyId][_financingId].status ==
                FinancingStatus.Pending,
            "Financing request already approved or rejected"
        );
        require(
            financings[_propertyId][_financingId].lender == _msgSender(),
            "Caller is not the lender"
        );

        financings[_propertyId][_financingId].status = FinancingStatus.Rejected;

        emit FinanceRejection(
            _msgSender(),
            _ownerOf(_propertyId),
            _propertyId,
            _financingId
        );
    }

    // Loaner shall pay monthly
    function makePayment() external payable virtual {
        revert("Not implemented");
    }

    // Loaner may default on mortgage
    function defaultOnFinancing() external virtual onlyOwner {
        revert("Not implemented");
    }
}
