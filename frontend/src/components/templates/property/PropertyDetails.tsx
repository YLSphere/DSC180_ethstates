import { Box, Button, Text, Image, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import {
  useCancelForSale,
  useListForSale,
} from "../../../hooks/dapp/useDapp";
import { Nft } from "../../../types/dapp";

interface Props {
  id: number;
  address: `0x${string}` | undefined;
  nft: Nft | undefined;
}

const PropertyDetails = (props: Props) => {
  const toast = useToast();
  const { id, address, nft } = props;
  const listForSale = useListForSale();
  const cancelForSale = useCancelForSale();

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (listForSale.isLoading) {
      toast({
        status: "loading",
        title: "Property NFT pending to be listed",
        description: "Please wait",
      });
    }

    // When the mutation fails, show a toast
    if (listForSale.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be listed",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (listForSale.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT listed",
        description: "Looks great",
        duration: 5000,
      });
    }
  }, [listForSale.isLoading, listForSale.isError, listForSale.isSuccess]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (cancelForSale.isLoading) {
      toast({
        status: "loading",
        title: "Property NFT pending to be removed from sale",
        description: "Please wait",
      });
    }

    // When the mutation fails, show a toast
    if (cancelForSale.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be removed from sale",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (cancelForSale.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT removed from sale",
        description: "Looks great",
        duration: 5000,
      });
    }
  }, [cancelForSale.isLoading, cancelForSale.isError, cancelForSale.isSuccess]);

  return (
    <Box>
      {nft ? (
        <Box>
          <Text>{`Price: ${nft?.price}`}</Text>
          <Text>{`Property ID: ${nft?.propertyId}`}</Text>
          <Text>{`URI: ${nft?.uri}`}</Text>
          <Text>{`Buyer: ${nft?.buyer}`}</Text>
          <Text>{`Want to sell? ${nft?.wantSell}`}</Text>
          {nft.wantSell ? (
            <Button onClick={() => cancelForSale.mutate({ address, id })}>
              Remove From Sale
            </Button>
          ) : (
            <Button onClick={() => listForSale.mutate({ address, id })}>
              List For Sale
            </Button>
          )}
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
