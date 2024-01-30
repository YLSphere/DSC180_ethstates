// contracts/Servicing.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./Financing.sol";

contract ServicingContract is FinancingContract {
    function __ServicingContract_init() internal {
        __FinancingContract_init();
    }

    function makePayment(
        uint256 _propertyId,
        uint256 _financingId
    ) external payable isPropertyOwner(_propertyId) {
        require(
            financings[_propertyId].length > 0,
            "No financing request for this property"
        );
        require(
            financings[_propertyId][_financingId].status ==
                FinancingStatus.Active,
            "Financing not active"
        );
        require(
            msg.value >= financings[_propertyId][_financingId].monthlyPayment,
            "Insufficient payment"
        );

        financings[_propertyId][_financingId].paidMonths++;
        payable(_msgSender()).transfer(
            msg.value - financings[_propertyId][_financingId].monthlyPayment
        ); // refund excess payment

        if (
            financings[_propertyId][_financingId].paidMonths ==
            financings[_propertyId][_financingId].durationInMonths
        ) {
            // if mortgage is paid
            financings[_propertyId][_financingId].status = FinancingStatus
                .PaidOff;

            emit PaidOff(
                financings[_propertyId][_financingId].lender,
                _msgSender(),
                _propertyId,
                _financingId
            );
        } else {
            emit Payment(
                financings[_propertyId][_financingId].lender,
                _msgSender(),
                _propertyId,
                _financingId,
                financings[_propertyId][_financingId].paidMonths,
                financings[_propertyId][_financingId].monthlyPayment
            );
        }
    }

    // Function to default on mortgage
    function defaultOnFinancing(
        uint256 _propertyId,
        uint256 _financingId
    ) external onlyOwner {
        require(
            financings[_propertyId].length > 0,
            "No financing request for this property"
        );
        require(
            financings[_propertyId][_financingId].status ==
                FinancingStatus.Active,
            "Financing not active"
        );
        address loaner = _ownerOf(_propertyId);

        financings[_propertyId][_financingId].status = FinancingStatus.Default;
        emit Default(
            financings[_propertyId][_financingId].lender,
            loaner,
            _propertyId,
            _financingId
        );

        _transfer(
            loaner,
            financings[_propertyId][_financingId].lender,
            _propertyId
        ); // transfer property nft to lender
        emit Transfer(
            loaner,
            financings[_propertyId][_financingId].lender,
            _propertyId,
            financings[_propertyId][_financingId].loanAmount
        );
    }
}
