import { Badge, Container, Heading, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import NftCard from "../components/templates/property/NftCard";
import NftCollection from "../components/templates/property/NftCollection";

import { useGetAllPropertiesByOwner } from "../hooks/marketplace/useProperty";

import { Nft } from "../types/listing";

export default function Profile() {
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);

  const { address, isConnected } = useAccount();
  const { isFetched, data } = useGetAllPropertiesByOwner(address);

  useEffect(() => {
    if (isConnected && isFetched) {
      setNfts(data);
    }
  }, [isConnected, isFetched]);

  // Wallet not connected
  if (!isConnected) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
          maxWidth="container.lg"
        >
          <Text fontSize={"3xl"} color={"gray.500"}>
            Connect to your wallet first!
          </Text>
        </Container>
      </main>
    );
  }

  // NFTs are loading
  if (!isFetched) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
          maxWidth="container.lg"
        >
          <Spinner size="xl" color="green" />
        </Container>
      </main>
    );
  }

  // NFTs are loaded
  return (
    <main>
      <Container maxWidth="container.lg">
        <Heading as="h1" size="xl" mt={8}>
          Properties Owned{" "}
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
          {nfts?.map((nft, i) => {
            return (
              <NftCard
                key={i}
                propertyId={nft.property.propertyId}
                beds={nft.pinataContent.bedrooms}
                baths={nft.pinataContent.bathrooms}
                streetAddress={nft.pinataContent.streetAddress}
                price={nft.property.price.toString()}
                imageUrl={
                  nft.pinataContent.images[0]
                    ? `${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${
                        nft.pinataContent.images[0]
                      }`
                    : ""
                }
              />
            );
          })}
        </NftCollection>
      </Container>
    </main>
  );
}
