import { Badge, Box, Container, Heading, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import NftCard from "../components/templates/property/NftCard";
import NftCollection from "../components/templates/property/NftCollection";

import { useGetAllPropertiesByOwner } from "../hooks/dapp/useDapp";

import { Nft } from "../types/dapp";

export default function Profile() {
  const [nfts, setNfts] = useState<Nft[]>([]);

  const { address, isConnected } = useAccount();
  const { isLoading, data } = useGetAllPropertiesByOwner(address);

  useEffect(() => {
    if (isConnected && !isLoading) {
      console.log(data);
      setNfts(data);
    }
  }, [isConnected, isLoading, data]);

  return (
    <main>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <Spinner size="xl" color="green" />
        </Box>
      ) : (
        <Container maxWidth="container.lg">
          <Heading as="h1" size="xl" mt={8}>
            NFT Collection{" "}
            <Badge
              borderRadius="full"
              fontSize="x-large"
              px="2"
              colorScheme="green"
            >
              {nfts?.length}
            </Badge>
          </Heading>

          <NftCollection>
            {nfts.map((nft, i) => {
              // console.log(nft);
              return (
                <NftCard
                  key={i}
                  propertyId={nft.propertyId}
                  beds={nft.bedrooms}
                  baths={nft.bathrooms}
                  streetAddress={nft.streetAddress}
                  formattedPrice={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(nft.price)}
                  imageUrl={
                    nft.images[0]
                      ? `https://gateway.pinata.cloud/ipfs/${nft.images[0]}`
                      : ""
                  }
                />
              );
            })}
          </NftCollection>
        </Container>
      )}
    </main>
  );
}
