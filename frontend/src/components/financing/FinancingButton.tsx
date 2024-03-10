import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Nft } from "../../types/listing";
import { useEffect, useRef, useState } from "react";
import { useGetLoans } from "../../hooks/financing/useLoan";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  type UseReadContractsReturnType,
} from "wagmi";
import contractAddress from "../../contracts/contract-address.json";
import financingArtifact from "../../contracts/FinancingContract.json";
import marketplaceArtifact from "../../contracts/ListingContract.json";
import { ethers } from "ethers";
import PropertyApproval from "../property/PropertyApproval";

interface Props {
  nft: Nft;
  address: `0x${string}` | undefined;
  refetch: () => void;
}

interface Financing {
  propertyId: bigint;
  loaner: `0x${string}`;
  loanId: bigint;
  status: bigint;
  loanAmount: bigint;
  durationInMonths: bigint;
  paidMonths: bigint;
}

const statusMap = {
  0: "None",
  1: "Pending",
  2: "Rejected",
  3: "Active",
  4: "Default",
  5: "PaidOff",
};

export function FinancingButton({ nft, address, refetch }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const { data } = useGetLoans(address);
  const { data: financingData, isFetched, refetch: refetchFinancing } =
    useReadContract({
      address: contractAddress.FinancingContractProxy as `0x${string}`,
      abi: financingArtifact.abi,
      functionName: "getFinancingWithId",
      args: [BigInt(nft.listing?.acceptedBid?.financingId as number)],
    });
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const isDisabled = nft.listing?.acceptedBid?.financingId !== 0;
  const [loanId, setLoanId] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [loanDuration, setLoanDuration] = useState<number>(0);
  const [financing, setFinancing] = useState<{
    propertyId: number;
    loaner: string;
    loanId: number;
    status: string;
    loanAmount: number;
    durationInMonths: number;
    paidMonths: number;
  }>();

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Financing Requested",
        description: "Financing request has been submitted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetchFinancing();
    }

    if (isConfirming) {
      toast({
        title: "Financing Requesting",
        description: "Financing request is being submitted",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Pending",
        description: "Confirming financing request",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "error") {
      toast({
        title: "Rejected",
        description: "Action Rejected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isConfirming, isConfirmed, status]);

  useEffect(() => {
    if (isFetched && financingData) {
      console.log(financingData);
      setFinancing({
        propertyId: parseInt(financingData.propertyId.toString()),
        loaner: financingData.loaner,
        loanId: parseInt(financingData.loanId.toString()),
        status: statusMap[parseInt(financingData.status.toString())],
        loanAmount: parseFloat(ethers.formatEther(financingData.loanAmount)),
        durationInMonths: parseInt(financingData.durationInMonths.toString()),
        paidMonths: parseInt(financingData.paidMonths.toString()),
      });
    }
  }, [isFetched, financingData]);

  function financingStatus() {
    if (nft.listing?.acceptedBid?.financingId === 0) {
      return (
        <Box mt={2}>
          <p>Not Financed</p>
        </Box>
      );
    }

    return (
      <Box mt={3}>
        <p>Financed</p>
        <p>Financing ID: {nft.listing?.acceptedBid?.financingId}</p>
        <p>Status: {financing?.status}</p>
        <p>Loaner: {financing?.loaner}</p>
        <p>Loan Amount: {financing?.loanAmount.toFixed(2)}</p>
        <p>Duration: {financing?.durationInMonths}</p>
        <p>Paid Months: {financing?.paidMonths}</p>
      </Box>
    );
  }

  if (
    address &&
    nft.listing?.propertyId === nft.property.propertyId && // is listed
    nft.listing?.acceptedBid?.bidder === address && // is the accepted bidder
    nft.listing?.sellerApproved === true && // seller approved
    nft.listing?.buyerApproved === false // buyer not approved
  ) {
    return (
      <>
        <Button size="sm" colorScheme="green" ref={btnRef} onClick={onOpen}>
          Transfer
        </Button>
        <Drawer
          size="md"
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Need Financing?</DrawerHeader>

            <DrawerBody>
              <form
                id="financing-form"
                onSubmit={(e) => {
                  e.preventDefault();

                  if (!loanId || loanAmount === 0 || loanDuration === 0) {
                    toast({
                      title: "Invalid Input",
                      description: "Please fill out all fields",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    return;
                  }

                  writeContract({
                    address:
                      contractAddress.ListingContractProxy as `0x${string}`,
                    abi: marketplaceArtifact.abi,
                    functionName: "requestFinancing",
                    args: [
                      loanId,
                      nft.listing?.propertyId,
                      ethers.parseEther(loanAmount.toString()),
                      loanDuration,
                    ],
                  });
                }}
              >
                <Select
                  placeholder="Select Investor"
                  onChange={(e) => setLoanId(parseInt(e.target.value))}
                  isDisabled={isDisabled}
                >
                  {data?.map((loan, index) => (
                    <option key={index} value={index + 1}>
                      {`${loan.lender.slice(0, 6)}...${loan.lender.slice(
                        -4
                      )} - ${loan.annualInterestRate / 100}% - ${
                        loan.maxDurationInMonths
                      }`}
                    </option>
                  ))}
                </Select>

                <NumberInput
                  mt={4}
                  defaultValue={0}
                  precision={2}
                  step={0.5}
                  min={0}
                  onChange={(valueString) =>
                    setLoanAmount(parseFloat(valueString))
                  }
                  isDisabled={isDisabled}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <NumberInput
                  mt={4}
                  defaultValue={0}
                  precision={0}
                  step={1}
                  min={0}
                  onChange={(valueString) =>
                    setLoanDuration(parseInt(valueString))
                  }
                  isDisabled={isDisabled}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </form>

              {financingStatus()}
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                form="financing-form"
                isDisabled={isDisabled}
              >
                Finance
              </Button>
              <PropertyApproval
                nft={nft}
                address={address}
                refetch={() => {
                  refetch();
                  onClose();
                }}
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
  return <></>;
}
