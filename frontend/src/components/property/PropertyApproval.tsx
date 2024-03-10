import { Button, useToast } from "@chakra-ui/react";
import { Nft } from "../../types/listing";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../contracts/contract-address.json";
import marketplaceArtifact from "../../contracts/ListingContract.json";
import { useEffect } from "react";
import { ethers } from "ethers";

interface Props {
  address: `0x${string}` | undefined;
  nft: Nft;
  refetch: () => void;
}

export default function PropertyApproval({ nft, address, refetch }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Approved",
        description: "Transfer has been approved",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
    }

    if (isConfirming) {
      toast({
        title: "Approving Transfer",
        description: "Transfer is being approved",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Approving Transfer",
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
      onClick={() =>
        writeContract({
          address: contractAddress.ListingContractProxy as `0x${string}`,
          abi: marketplaceArtifact.abi,
          functionName: "approveTransferAsBuyer",
          args: [BigInt(nft.property.propertyId)],
          value: ethers.parseEther(
            nft.listing!.acceptedBid!.bidPrice.toString()
          ),
          account: address,
        })
      }
    >
      Approve
    </Button>
  );
}
