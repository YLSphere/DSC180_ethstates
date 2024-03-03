import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import marketplaceArtifact from "../../../contracts/ListingContract.json";
import contractAddress from "../../../contracts/contract-address.json";
import { useNavigate } from "react-router-dom";

interface Props {
  isDisabled: boolean;
  propertyId: number;
}

export function RemoveButton({ isDisabled, propertyId }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { isOpen, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Property Removed",
        description: "Property has been removed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => navigate("/profile"), 5000);
    }

    if (isConfirming) {
      toast({
        title: "Removing Property",
        description: "Property is being removed",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Removing Property",
        description: "Please confirm on wallet",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "error") {
      toast({
        title: "Rejected",
        description: "Action rejected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isConfirmed, isConfirming, status]);

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Button
          colorScheme="gray"
          onClick={onToggle}
          isDisabled={isConfirming || isDisabled}
        >
          <DeleteIcon />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader fontWeight="semibold">Confimration</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            Are you sure you want to remove this property?
          </PopoverBody>
          <PopoverFooter>
            <ButtonGroup size="sm">
              <Button variant="outline" onClick={onToggle}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isDisabled={isConfirming}
                onClick={() => {
                  writeContract({
                    address:
                      contractAddress.ListingContractProxy as `0x${string}`,
                    abi: marketplaceArtifact.abi,
                    functionName: "removeProperty",
                    args: [BigInt(propertyId)],
                  });
                }}
              >
                Remove
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
