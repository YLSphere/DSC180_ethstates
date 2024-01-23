import { Badge, Box, Container, Heading, Spinner } from "@chakra-ui/react";
import NftCard from "../components/templates/property/NftCard";
import NftCollection from "../components/templates/property/NftCollection";
import { useGetAllPropertiesForSale } from "../hooks/dapp/useDapp";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Nft } from "../types/dapp";

export default function Marketplace() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);
  const { isLoading, data } = useGetAllPropertiesForSale(address);

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
        <Container maxWidth="container.lg" my={5}>
          <Heading as="h1" size="xl" mt={8}>
            Marketplace{" "}
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
            {/* Demo */}
            {/* {Array(propertyCount)
            .fill("")
            .map((_, i) => (
              <NftCard key={i} isLoading={true} />
            ))} */}

            {nfts?.map((nft, i) => (
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
            ))}
          </NftCollection>
        </Container>
      )}
    </main>
  );
}
