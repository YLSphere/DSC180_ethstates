import { Button } from "@chakra-ui/react";
import { Nft } from "../../types/listing";
import { useList, useUnlist } from "../../hooks/marketplace/useListing";

interface Props {
  address: `0x${string}`;
  nft: Nft;
}

export default function PropertyListing({ nft, address }: Props) {
  const list = useList();
  const unlist = useUnlist();

  if (nft.owner !== address) {
    return <></>;
  }

  if (
    nft.listing?.propertyId === nft.property.propertyId // is listed
  ) {
    return (
      <Button
        colorScheme="red"
        onClick={() =>
          unlist.mutate({ address, id: nft.property.propertyId })
        }
      >
        Unlist
      </Button>
    );
  } else {
    return (
      <Button
        colorScheme="yellow"
        onClick={() => list.mutate({ address, id: nft.property.propertyId })}
      >
        List
      </Button>
    );
  }
}