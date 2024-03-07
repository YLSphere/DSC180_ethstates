import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../../contracts/contract-address.json";
import marketplaceArtifact from "../../../contracts/ListingContract.json";
import { useEffect } from "react";
import { Button, useToast } from "@chakra-ui/react";

interface Props {
  isAccepted: boolean;
  propertyId: number;
  bidder: `0x${string}`;
  refetch: () => void;
}

export function AcceptButton({ isAccepted, propertyId, bidder, refetch }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Offer Accepted",
        description: "Offer has been accepted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
    }

    if (isConfirming) {
      toast({
        title: "Accepting Offer",
        description: "Offer is being accepted",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Accepting Offer",
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
      colorScheme="green"
      size="xs"
      isDisabled={isAccepted}
      onClick={() =>
        writeContract({
          address: contractAddress.ListingContractProxy as `0x${string}`,
          abi: marketplaceArtifact.abi,
          functionName: "acceptOffer",
          args: [BigInt(propertyId), bidder],
        })
      }
    >
      Accept
    </Button>
  );
}
