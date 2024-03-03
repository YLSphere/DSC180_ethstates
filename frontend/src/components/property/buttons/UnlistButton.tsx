import { Button, useToast } from "@chakra-ui/react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../../contracts/contract-address.json";
import marketplaceArtifact from "../../../contracts/ListingContract.json";
import { useEffect } from "react";

interface Props {
  isDisabled: boolean;
  propertyId: number;
  refetch: () => void;
}

export function UnlistButton({ isDisabled, propertyId, refetch }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Property Unlisted",
        description: "Property has been unlisted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(refetch, 3000);
    }

    if (isConfirming) {
      toast({
        title: "Unlisting Property",
        description: "Property is being unlisted",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Unlisting Property",
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
        size="sm"
        isDisabled={isDisabled}
        colorScheme="red"
        onClick={() => (
          writeContract({
            address: contractAddress.ListingContractProxy as `0x${string}`,
            abi: marketplaceArtifact.abi,
            functionName: "unlistProperty",
            args: [BigInt(propertyId)],
          })
    )}
      >
        Unlist
      </Button>
}