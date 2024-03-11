import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../../contracts/contract-address.json";
import marketplaceArtifact from "../../../contracts/ListingContract.json";
import { useEffect } from "react";
import { Button, useToast } from "@chakra-ui/react";

interface Props {
  propertyId: number;
  refetch: () => void;
}

export function UnbidButton({ propertyId, refetch }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Property Unbid",
        description: "Property has been unbid",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(refetch, 3000);
    }

    if (isConfirming) {
      toast({
        title: "Unbidding Property",
        description: "Property is being unbid",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Unbidding Property",
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
      colorScheme="red"
      size="xs"
      onClick={() =>
        writeContract({
          address: contractAddress.ListingContractProxy as `0x${string}`,
          abi: marketplaceArtifact.abi,
          functionName: "unbid",
          args: [BigInt(propertyId)],
        })
      }
    >
      Unbid
    </Button>
  );
}
