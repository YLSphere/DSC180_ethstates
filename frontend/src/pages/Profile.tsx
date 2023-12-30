import { Container, Heading } from "@chakra-ui/react";
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
      <Container maxWidth="container.lg">
        <Heading as="h1" size="xl" mt={8}>
          NFT Collection
        </Heading>

        <NftCollection>
          {nfts.map((nft, i) => {
            // console.log(nft);
            return (
              <NftCard
                h="200px"
                isLoading={isLoading}
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
    </main>
  );
}
