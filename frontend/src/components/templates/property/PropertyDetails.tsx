import { Box, Button, Text, Image, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useUnlist, useList } from "../../../hooks/dapp/useListing";
import { BidResultIndex, Nft } from "../../../types/dapp";
import { useAcceptOffer, useBid } from "../../../hooks/dapp/useBidding";

interface Props {
  id: number;
  address: `0x${string}` | undefined;
  nft: Nft | undefined;
  isOwner: boolean;
}

const PropertyDetails = (props: Props) => {
  const toast = useToast();
  const { id, address, nft, isOwner } = props;

  // listing hooks
  const list = useList();
  const unlist = useUnlist();

  // bidding hooks
  const bid = useBid();
  const acceptOffer = useAcceptOffer();

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (list.isPending) {
      toast({
        status: "loading",
        title: "Property NFT pending to be listed",
        description: "Please wait",
      });
    }

    // When the mutation fails, show a toast
    if (list.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be listed",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (list.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT listed",
        description: "Looks great",
        duration: 5000,
      });
    }
  }, [list]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (unlist.isPending) {
      toast({
        status: "loading",
        title: "Property NFT pending to be removed from sale",
        description: "Please wait",
      });
    }

    // When the mutation fails, show a toast
    if (unlist.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be removed from sale",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (unlist.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT removed from sale",
        description: "Looks great",
        duration: 5000,
      });
    }
  }, [unlist]);

  const listingButton = () => {
    if (isOwner) {
      return nft?.sellPrice == 0 ? (
        <Button
          onClick={() => list.mutate({ address, id, sellPrice: nft?.price })}
        >
          List
        </Button>
      ) : (
        <Button onClick={() => unlist.mutate({ address, id })}>Unlist</Button>
      );
    }
  };

  const biddingButton = () => {
    if (
      !isOwner &&
      nft?.sellPrice !== 0 &&
      nft?.acceptedBid?.[BidResultIndex.BID_PRICE] !== 0
    ) {
      return (
        <Button
          onClick={() => bid.mutate({ address, id, bidPrice: 1_200_000 })}
        >
          Bid
        </Button>
      );
    }
  };

  return (
    <Box>
      {nft ? (
        <Box>
          <Text>{`Property ID: ${nft?.propertyId}`}</Text>
          <Text>{`URI: ${nft?.uri}`}</Text>

          {listingButton()}

          {biddingButton()}

          {nft?.bids?.map((bid, i) => (
            <div key={i}>
              <Text>{`Bidder: ${bid[BidResultIndex.BIDDER]} | Price: ${
                bid[BidResultIndex.BID_PRICE]
              }`}</Text>
              {isOwner && nft?.acceptedBid?.[BidResultIndex.BID_PRICE] == 0 ? (
                <Button
                  onClick={() =>
                    acceptOffer.mutate({
                      address,
                      id: nft?.propertyId,
                      bidder: bid[BidResultIndex.BIDDER],
                    })
                  }
                >
                  Accept Offer
                </Button>
              ) : null}
            </div>
          ))}

          {nft.images.map((image, i) => (
            <Image
              key={i}
              src={`${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${image}`}
            />
          ))}
        </Box>
      ) : (
        <Text>Nothin for now</Text>
      )}
    </Box>
  );
};

export { PropertyDetails };
