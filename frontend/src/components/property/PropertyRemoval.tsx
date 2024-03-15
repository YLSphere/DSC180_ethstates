import { Nft } from "../../types/listing";
import { RemoveButton } from "./buttons/RemoveButton";

interface Props {
  nft: Nft;
  address: `0x${string}` | undefined;
}

export function PropertyRemoval({ nft, address }: Props) {
  const disableRemove =
    nft.listing?.propertyId !== 0 || nft.financing?.propertyId !== 0;

  if (!address || nft.owner !== address || disableRemove) {
    return <></>;
  } else {
    return <RemoveButton propertyId={nft.property.propertyId} />;
  }
}
