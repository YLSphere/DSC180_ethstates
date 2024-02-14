import { Button } from "@chakra-ui/react";
import { Nft } from "../../types/listing";
import { useApproveTransferAsBuyer } from "../../hooks/marketplace/useBidding";

interface Props {
  address: `0x${string}`;
  nft: Nft;
}

export default function PropertyApproval({ nft, address }: Props) {
  const buyerApprove = useApproveTransferAsBuyer();

  if (
    nft.listing?.propertyId === nft.property.propertyId && // is listed
    nft.listing?.acceptedBid?.bidder === address && // is the accepted bidder
    nft.listing?.sellerApproved === true && // seller approved
    nft.listing?.buyerApproved === false // buyer not approved
  ) {
    return (
      <Button
        colorScheme="green"
        onClick={() =>
          buyerApprove.mutate({
            address,
            id: nft.property.propertyId,
            bidPrice: nft.listing!.acceptedBid!.bidPrice,
          })
        }
      >
        Approve
      </Button>
    );
  }
  return <></>;
}
