import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Container,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import NftCard from "../components/property/NftCard";
import NftCollection from "../components/property/NftCollection";

import { useGetAllPropertiesByOwner } from "../hooks/marketplace/useProperty";

import { Nft } from "../types/listing";
import { CHAIN_ID } from "../types/constant";

export default function Profile() {
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);
  const { address, chain, isConnected } = useAccount();
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
          height="80vh"
          maxWidth="container.sm"
        >
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize={10} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Wallet not found
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please connect to your web3 wallet to continue.
            </AlertDescription>
          </Alert>
        </Container>
      </main>
    );
  }

  // Wrong network
  if (isConnected && chain?.id !== CHAIN_ID) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          maxWidth="container.sm"
        >
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize={10} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Wrong network
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please connect to Polygon Mumbai Testnet to continue.
            </AlertDescription>
          </Alert>
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
                price={nft.property.price.toFixed(2).toString()}
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
