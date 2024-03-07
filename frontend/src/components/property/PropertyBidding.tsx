import { useEffect, useState } from "react";
import { Nft } from "../../types/listing";
import {
  Button,
  FormControl,
  Image,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import Polygon from "../../assets/polygon.svg";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../contracts/contract-address.json";
import marketplaceArtifact from "../../contracts/ListingContract.json";
import { ethers } from "ethers";
import { set } from "lodash";

interface Props {
  address: `0x${string}` | undefined;
  nft: Nft;
  refetch: () => void;
}

export default function PropertyBidding({ nft, address, refetch }: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [bidPrice, setBidPrice] = useState<number>(0);

  useEffect(() => {
    if (!address) {
      setIsDisabled(true);
      return;
    }

    let found = false;
    nft.listing?.bids?.forEach((bid) => {
      if (bid.bidder === address) {
        setIsDisabled(true);
        found = true;
        return;
      }
    });

    if (!found) {
      setIsDisabled(false);
    }
  }, [nft, address]);

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Bid placed",
        description: "Your bid has been placed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(refetch, 5000);
    }

    if (isConfirming) {
      toast({
        title: "Placing bid",
        description: "Your bid is being placed",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Placing bid",
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

  if (
    nft.owner !== address && // not the owner
    nft.listing?.propertyId === nft.property.propertyId && // is listed
    nft.listing?.acceptedBid?.bidPrice === 0 // not accepted
  ) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (Math.abs(bidPrice - 0) < 0.0001) {
            toast({
              title: "Invalid bid",
              description: "Please enter a valid bid price",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          writeContract({
            address: contractAddress.ListingContractProxy as `0x${string}`,
            abi: marketplaceArtifact.abi,
            functionName: "bid",
            args: [BigInt(nft.property.propertyId), ethers.parseEther(bidPrice.toString())],
          });
        }}
      >
        <FormControl
          isDisabled={isDisabled}
          maxW={"3xs"}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          gap={3}
        >
          <InputGroup>
            <InputRightElement pointerEvents="none">
              <Image src={Polygon} alt="logo" h={5} w={5} color="gray"/>
            </InputRightElement>
            <NumberInput precision={2}>
              <NumberInputField
                placeholder="Bid price"
                onChange={(e) => setBidPrice(parseFloat(e.target.value))}
              />
            </NumberInput>
          </InputGroup>
          <Button type="submit" colorScheme="blue" isDisabled={isDisabled}>
            Bid
          </Button>
        </FormControl>
      </form>
    );
  }

  return <></>;
}
