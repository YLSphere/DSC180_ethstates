import { useEffect, useState } from "react";
import { useBid } from "../../hooks/marketplace/useBidding";
import { Nft } from "../../types/listing";
import {
  Button,
  FormControl,
  Image,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import Polygon from "./assets/polygon.svg";

interface Props {
  address: `0x${string}`;
  nft: Nft;
}

export default function PropertyBidding({ nft, address }: Props) {
  const bid = useBid();
  const [isBidded, setIsBidded] = useState<boolean>(false);
  const [bidPrice, setBidPrice] = useState<number>(0);

  useEffect(() => {
    nft.listing?.bids?.forEach((bid) => {
      if (bid.bidder === address) {
        setIsBidded(true);
        return;
      }
    });
  }, [nft.listing?.bids, address]);

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
              <Image src={Polygon} alt="logo" h={5} w={5} color="gray"/>
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
