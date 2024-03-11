// contracts/Financing.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Loaning.sol";

contract FinancingContract is
    Initializable,
    OwnableUpgradeable,
    LoaningContract
{
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

    uint256 public financingCount; // total number of financings
    mapping(uint256 => Financing) public financings; // mapping of propertyId to Financing struct
    mapping(uint256 => uint256) public propertyToFinancing; // mapping of financingId to propertyId

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

    error FinancingNotPending();
    error FinancingNotFound();
    error AlreadyFinanced();
    error InsufficientBalance();

    modifier exists(uint256 _financingId) {
        if (financings[_financingId].loaner == address(0)) {
            revert FinancingNotFound();
        }
        _;
    }

    // Modifier to check if the property is currently being financed twice
    modifier cannotFinanceWithSameLoaner(uint256 _propertyId, address _loaner) {
        uint256 financingId = propertyToFinancing[_propertyId];
        if (
            financings[financingId].loaner == _loaner &&
            financings[_propertyId].status == FinancingStatus.Active
        ) {
            revert AlreadyFinanced();
        }
        _;
    }

    function initialize() external initializer {
        __Ownable_init();
        financingCount = 0;
    }

    // Lenders shall lend money to the owner of the property
    function financingRequest(
        uint256 _loanId,
        uint256 _propertyId,
        uint256 _loanAmount, // in wei
        uint256 _durationInMonths
    )
        external
        // Property cannot have active financing with the same loaner
        cannotFinanceWithSameLoaner(_propertyId, _msgSender())
        returns (uint256)
    {
        Loan storage loan = loans[_loanId];
        if (loan.lender == address(0)) {
            revert LoanNotFound();
        }

        address loaner = _msgSender();
        financingCount++;
        financings[_propertyId] = Financing({
            propertyId: _propertyId,
            loaner: loaner,
            loanId: _loanId,
            status: FinancingStatus.Pending,
            loanAmount: _loanAmount,
            durationInMonths: _durationInMonths,
            paidMonths: 0
        });
        emit FinanceRequest(loan.lender, loaner, _propertyId);
        return financingCount;
    }

    // Lender shall approve the financing request
    function approveFinancing(uint256 _financingId) external payable {
        Financing storage financing = financings[_financingId];
        if (financing.status != FinancingStatus.Pending) {
            revert FinancingNotPending();
        }
        if (loans[financing.loanId].lender != _msgSender()) {
            revert NotLender();
        }
        if (msg.value < financing.loanAmount) {
            revert InsufficientBalance();
        }

        financing.status = FinancingStatus.Active;
        emit FinanceApproval(
            _msgSender(),
            financing.loaner,
            financing.propertyId
        );
    }

    // Lender shall reject the financing request
    function rejectFinancing(uint256 _financingId) external {
        Financing storage financing = financings[_financingId];
        if (financing.status != FinancingStatus.Pending) {
            revert FinancingNotPending();
        }
        if (loans[financing.loanId].lender == _msgSender()) {
            revert NotLender();
        }

        financing.status = FinancingStatus.Rejected;
        emit FinanceRejection(
            _msgSender(),
            financing.loaner,
            financing.propertyId
        );
    }

    // =========== Servicing functions ===========

    // Get remaining balance
    function remainingBalance(
        uint256 _propertyId
    ) external view returns (uint256) {
        // TODO: Implement remaining balance
        Financing storage financing = financings[_propertyId];
        if (financing.status != FinancingStatus.Active) {
            return 0;
        }
        return financing.loanAmount;
    }

    // Loaner sell property and pay off mortgage
    function payOffFinancing(uint256 _propertyId) external {
        // TODO: Implement pay off financing
        Financing storage financing = financings[_propertyId];
        emit PaidOff(
            loans[financing.loanId].lender,
            financing.loaner,
            _propertyId
        );
    }

    // =========== Utility functions ===========

    // Function to get financing with propertyId
    function getFinancing(
        uint256 _propertyId
    ) external view returns (Financing memory) {
        uint256 financingId = propertyToFinancing[_propertyId];
        return financings[financingId];
    }

    // Function to get financing with propertyId
    function getFinancingId(
        uint256 _propertyId
    ) external view returns (uint256) {
        return propertyToFinancing[_propertyId];
    }

    function setFinancingId(
        uint256 _propertyId,
        uint256 _financingId
    ) external {
        propertyToFinancing[_propertyId] = _financingId;
    }
}
