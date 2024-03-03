import {
  Editable,
  EditableInput,
  EditablePreview,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
} from "@chakra-ui/react";
import Polygon from "./assets/polygon.svg";
import { Nft } from "../../types/listing";
import { useEffect, useState } from "react";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../contracts/contract-address.json";
import marketplaceArtifact from "../../contracts/ListingContract.json";
import { ethers } from "ethers";

interface Props {
  nft: Nft;
  address: `0x${string}` | undefined;
  refetch: () => void;
}

export default function PropertyPrice({ nft, address, refetch }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [price, setPrice] = useState(nft.property.price.toString());
  const isOwner = nft.owner === address;

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Price updated",
        description: "The price has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(refetch, 3000);
    }

    if (isConfirming) {
      toast({
        title: "Updating price",
        description: "The price is being updated",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Updating price",
        description: "Please confirm on Metamask",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "error") {
      setPrice(nft.property.price.toString());
      toast({
        title: "Rejection updating price",
        description: "Updating price has been rejected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, isConfirming, isConfirmed]);

  return (
    <Stat>
      <StatLabel>Property Price</StatLabel>
      <StatNumber display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <Image src={Polygon} alt="logo" height={5} width={5} mr={2} />
        {isOwner ? (
          <Editable
            defaultValue={nft.property.price.toString()}
            value={price.toString()}
            onChange={(e) => setPrice(e)}
            onSubmit={() => {
              if (parseFloat(price) === nft.property.price) return;
              if (parseFloat(price) <= 0) {
                toast({
                  title: "Error updating price",
                  description: "Price cannot be non positive",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
                return;
              }

              writeContract({
                address: contractAddress.ListingContractProxy as `0x${string}`,
                abi: marketplaceArtifact.abi,
                functionName: "setPrice",
                args: [nft.property.propertyId, ethers.parseEther(price)],
              });
            }}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        ) : (
          nft.property.price.toString()
        )}
      </StatNumber>
    </Stat>
  );
}
