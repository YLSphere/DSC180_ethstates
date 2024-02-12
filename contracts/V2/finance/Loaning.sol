// contracts/Loaning.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract LoaningContract {
    struct Loan {
        address lender;
        uint256 annualInterestRate; // in percentage (e.g 4.56% = 456)
    }

    uint256 public loanCount; // total number of lenders
    mapping(uint256 => Loan) public loans; // mapping of lenders

    event LoanAdded(uint256 loanId);
    event LoanRemoved(uint256 loanId);

    error LoanNotFound();

    // Add loan to lenders array
    function addLoan(
        address _lender,
        uint256 _annualInterestRate
    ) external {
        loanCount++;
        loans[loanCount] = Loan({
            lender: _lender,
            annualInterestRate: _annualInterestRate
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
