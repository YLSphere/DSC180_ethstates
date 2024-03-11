import { useEffect, useState } from "react";
import { Nft } from "../../types/listing";
import {
  Button,
  Container,
  FormControl,
  Image,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  Switch,
  useToast,
} from "@chakra-ui/react";
import Polygon from "../../assets/polygon.svg";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../contracts/contract-address.json";
import marketplaceArtifact from "../../contracts/ListingContract.json";
import { ethers } from "ethers";
import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
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
  const [alertIsOpen, setIsOpenAlert] = useState(false);

  // TERMS AND CONDITIONS MODAL

  function closeModalAlert() {
    setIsOpenAlert(false);
  };

  const handleSwitchChange = () => {
    setIsOpenAlert(!alertIsOpen);
    bid.mutate({
      address,
      id: nft.listing?.propertyId,
      bidPrice: bidPrice
    });
  };
  function openModalAlert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpenAlert(true);
  };

  useEffect(() => {
    if (!address) {
      setIsDisabled(true);
      return;
    }
    nft.listing?.bids?.forEach((bid) => {
      if (bid.bidder === address) {
        setIsDisabled(true);
        return;
      }
    });
  }, [nft.listing?.bids, address]);

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

          bid.mutate({
            address,
            id: nft.property.propertyId,
            bidPrice: bidPrice,
          });
        }}
      >
        <FormControl
          isDisabled={isBidded}
          maxW={"3xs"}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          gap={3}
        >
          <InputGroup>
            <InputRightElement pointerEvents="none">
              <FaEthereum color="gray" />
            </InputRightElement>
            <NumberInput precision={2}>
              <NumberInputField
                placeholder="Bid price"
                onChange={(e) => setBidPrice(parseFloat(e.target.value))}
              />
            </NumberInput>
          </InputGroup>
          <Button type="submit" colorScheme="blue" isDisabled={isBidded}>
            Bid
          </Button>
        </FormControl>
      </form>
    );
  }

  return <></>;
}
