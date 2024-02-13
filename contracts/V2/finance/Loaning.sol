// contracts/Loaning.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract LoaningContract {
    struct Loan {
        address lender;
        uint256 annualInterestRate; // in percentage (e.g 4.56% = 456)
        uint256 maxDurationInMonths; // in months
    }

    uint256 public loanCount; // total number of lenders
    mapping(uint256 => Loan) public loans; // mapping of lenders

    event LoanAdded(uint256 loanId);
    event LoanRemoved(uint256 loanId);

    error LoanNotFound();
    error NotLender();

    modifier onlyLender(uint256 _loanId) {
        if (loans[_loanId].lender != msg.sender) {
            revert NotLender();
        }
        _;
    }

    // Add loan to lenders array
    function addLoan(
        address _lender,
        uint256 _annualInterestRate,
        uint256 _maxDurationInMonths
    ) external {
        loanCount++;
        loans[loanCount] = Loan({
            lender: _lender,
            annualInterestRate: _annualInterestRate,
            maxDurationInMonths: _maxDurationInMonths
        });
        emit LoanAdded(loanCount);
    }

    // Remove lender from lenders array
    function removeLoan(uint256 _loanId) external {
        if (loans[_loanId].lender == address(0)) {
            revert LoanNotFound();
        }
        delete loans[_loanId];
        loanCount--;
        emit LoanRemoved(_loanId);
    }

    // Update annual interest rate
    function setAnnualInterestRate(
        uint256 _loanId,
        uint256 _annualInterestRate
    ) external onlyLender(_loanId) {
        loans[_loanId].annualInterestRate = _annualInterestRate;
    }

    // Set max duration in months
    function setMaxDurationInMonths(
        uint256 _loanId,
        uint256 _maxDurationInMonths
    ) external onlyLender(_loanId) {
        loans[_loanId].maxDurationInMonths = _maxDurationInMonths;
    }

    // =========== Utility functions ===========

    // Get loan by id
    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }

    // Get all lenders
    function getAllLoans() external view returns (Loan[] memory) {
        Loan[] memory _loans = new Loan[](loanCount);
        for (uint256 i = 1; i <= loanCount; i++) {
            if (loans[i].lender != address(0)) {
                _loans[i - 1] = loans[i];
            }
        }
        return _loans;
    }
}
