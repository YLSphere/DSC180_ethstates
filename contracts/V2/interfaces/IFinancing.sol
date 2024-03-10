// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

interface IFinancing {
    struct Loan {
        address lender;
        uint256 annualInterestRate; // in percentage (e.g 4.56% = 456)
        uint256 maxDurationInMonths; // in months
        uint256 loanId;
    }

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
        address loaner;
        uint256 loanId;
        // Financing details
        FinancingStatus status;
        uint256 loanAmount;
        uint256 durationInMonths;
        uint256 paidMonths;
    }

    event LoanAdded(uint256 loanId);
    event LoanRemoved(uint256 loanId);
    event FinanceRequest(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );
    event FinanceApproval(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );
    event FinanceRejection(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );
    event PaidOff(
        address indexed _lender,
        address indexed _loaner,
        uint256 _propertyId
    );

    function financingRequest(
        address _loaner,
        uint256 _loanId,
        uint256 _propertyId,
        uint256 _loanAmount, // in wei
        uint256 _durationInMonths
    ) external returns (uint256);

    function approveFinancing(uint256 _financingId) external payable;

    function rejectFinancing(uint256 _financingId) external;

    function remainingBalance(
        uint256 _propertyId
    ) external view returns (uint256);

    function payOffFinancing(uint256 _propertyId) external;

    function addLoan(address _lender, uint256 _annualInterestRate) external;

    function removeLoan(uint256 _loanId) external;

    function getLoan(uint256 _loanId) external view returns (Loan memory);

    function getFinancingId(
        uint256 _propertyId
    ) external view returns (uint256);

    function getFinancing(
        uint256 _propertyId
    ) external view returns (Financing memory);

    function setFinancingId(uint256 _propertyId, uint256 _financingId) external;
}
