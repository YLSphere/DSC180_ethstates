import { Nft } from "../../types/listing";
import { ListButton } from "./buttons/ListButton";
import { UnlistButton } from "./buttons/UnlistButton";

interface Props {
  address: `0x${string}` | undefined;
  nft: Nft;
}

export default function PropertyListing({ nft, address }: Props) {
  if (nft.owner !== address) {
    return <></>;
  }

  if (
    address &&
    nft.listing?.propertyId === nft.property.propertyId // is listed
  ) {
    return (
      <UnlistButton propertyId={nft.property.propertyId} />
    );
  } else {
    return (
      <ListButton propertyId={nft.property.propertyId} />
    );
  }
}
