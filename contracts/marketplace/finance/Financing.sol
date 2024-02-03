// contracts/Financing.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./Loaning.sol";

library FinancingLibrary {
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
        address loaner;
        FinancingStatus status;
        // Financing details
        uint256 loanAmount;
        uint256 annualInterestRate; // in percentage (e.g 4.56% = 456)
        uint256 durationInMonths;
        uint256 paidMonths;
    }

    uint256 constant internal PERCISION = 2;

    function approve(Financing storage _financing) internal {
        _financing.status = FinancingStatus.Active;
        payable(_financing.loaner).transfer(_financing.loanAmount); // transfer money to owner
    }

    function reject(Financing storage _financing) internal {
        _financing.status = FinancingStatus.Rejected;
    }
}

contract FinancingContract is LoaningContract {
    using FinancingLibrary for FinancingLibrary.Financing;

    mapping(uint256 => FinancingLibrary.Financing) public financings; // mapping of propertyId to Financing struct

    function __FinancingContract_init() internal {
        __LoaningContract_init();
    }

    // Finance event
    event FinanceRequest(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );

    // Finance approval event
    event FinanceApproval(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );

    // Finance rejection event
    event FinanceRejection(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );

    // Paid off event
    event PaidOff(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );

    // Modifier to check if the property is currently being financed twice
    modifier cannotFinanceWithSameLoaner(uint256 _propertyId, address _loaner) {
        require(
            financings[_propertyId].loaner != _loaner ||
                financings[_propertyId].status !=
                FinancingLibrary.FinancingStatus.Active,
            "Property cannot have active financing with the same loaner"
        );
        _;
    }

    // Lenders shall lend money to the owner of the property
    function _financingRequest(
        uint256 _propertyId,
        address _lender,
        uint256 _loanAmount, // in wei
        uint256 _annualInterestRate, // in percentage
        uint256 _durationInMonths
    )
        internal
        cannotFinanceWithSameLoaner(_propertyId, _msgSender()) // Property cannot have active financing with the same loaner
        returns (FinancingLibrary.Financing memory)
    {
        address loaner = _msgSender(); // loaner is the caller

        emit FinanceRequest(_lender, loaner, _propertyId);
        return
            FinancingLibrary.Financing({
                propertyId: _propertyId,
                loaner: loaner,
                lender: _lender,
                status: FinancingLibrary.FinancingStatus.Pending,
                loanAmount: _loanAmount,
                annualInterestRate: _annualInterestRate,
                durationInMonths: _durationInMonths,
                paidMonths: 0
            });
    }

    // Loaner shall pay monthly
    function makePayment() external payable virtual {
        revert("Not implemented");
    }

    // Loaner may default on mortgage
    function defaultOnFinancing() external virtual onlyOwner {
        revert("Not implemented");
    }

    // Get remaining balance
    function remainingBalance(
        uint256 _propertyId
    ) public view returns (uint256) {
        // TODO: Implement remaining balance
        FinancingLibrary.Financing storage financing = financings[_propertyId];
        if (financing.status != FinancingLibrary.FinancingStatus.Active) {
            return 0;
        }

        return financing.loanAmount;
    }

    // Loaner sell property and pay off mortgage
    function payOffFinancing(uint256 _propertyId) internal virtual {
        // TODO: Implement pay off financing
        emit PaidOff(_msgSender(), _ownerOf(_propertyId), _propertyId);
    }
}
