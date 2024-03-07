import { Nft } from "../../types/listing";
import { ListButton } from "./buttons/ListButton";
import { UnlistButton } from "./buttons/UnlistButton";

interface Props {
  address: `0x${string}` | undefined;
  nft: Nft;
  refetch: () => void;
}

export default function PropertyListing({ nft, address, refetch }: Props) {
  const disableUnlist = nft.listing?.acceptedBid?.bidPrice !== 0;

  if (nft.owner !== address) {
    return <></>;
  }

  if (
    address &&
    nft.listing?.propertyId === nft.property.propertyId // is listed
  ) {
    return (
      <UnlistButton
        isDisabled={disableUnlist}
        propertyId={nft.property.propertyId}
        refetch={refetch}
      />
    );
  } else {
    return (
      <ListButton propertyId={nft.property.propertyId} refetch={refetch} />
    );
  }
}
