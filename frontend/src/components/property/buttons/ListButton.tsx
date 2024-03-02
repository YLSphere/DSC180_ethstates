import { Button, useToast } from "@chakra-ui/react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../../contracts/contract-address.json";
import marketplaceArtifact from "../../../contracts/ListingContract.json";
import { useEffect } from "react";

interface Props {
  propertyId: number;
}

export function ListButton({ propertyId }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Property Listed",
        description: "Property has been listed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }

    if (isConfirming) {
      toast({
        title: "Listing Property",
        description: "Property is being listed",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Listing Property",
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

  return <Button
        colorScheme="yellow"
        onClick={() => (
          writeContract({
            address: contractAddress.ListingContractProxy as `0x${string}`,
            abi: marketplaceArtifact.abi,
            functionName: "listProperty",
            args: [BigInt(propertyId)],
          })
    )}
      >
        List
      </Button>
}