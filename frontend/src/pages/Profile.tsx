import { Badge, Container, Heading, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import NftCard from "../components/templates/property/NftCard";
import NftCollection from "../components/templates/property/NftCollection";

import { useGetAllPropertiesByOwner } from "../hooks/dapp/useProperty";

import { Nft } from "../types/dapp";

export default function Profile() {
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);

  const { address, isConnected } = useAccount();
  const { isLoading, data } = useGetAllPropertiesByOwner(address);

  useEffect(() => {
    if (isConnected && !isLoading) {
      console.log(data);
      setNfts(data);
    }
  }, [isConnected, isLoading, data]);

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
  if (isLoading) {
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
          {nfts?.map((nft, i) => {
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
                    ? `${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${
                        nft.images[0]
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
