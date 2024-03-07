import { Button, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../../contracts/contract-address.json";
import marketplaceArtifact from "../../../contracts/ListingContract.json";

interface Props {
  propertyId: number;
  refetch: () => void;
}

export function UnacceptButton({ propertyId, refetch }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Offer Unaccepted",
        description: "Offer has been unaccepted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(refetch, 3000);
    }

    if (isConfirming) {
      toast({
        title: "Unaccepting Offer",
        description: "Offer is being unaccepted",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Unaccepting Offer",
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
    <Button
      colorScheme="gray"
      size="xs"
      isDisabled={isConfirming}
      onClick={() =>
        writeContract({
          address: contractAddress.ListingContractProxy as `0x${string}`,
          abi: marketplaceArtifact.abi,
          functionName: "undoAcceptOffer",
          args: [BigInt(propertyId)],
        })
      }
    >
      Undo
    </Button>
  );
}
