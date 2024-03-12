import React from "react";
import {
  Badge,
  Box,
  SimpleGrid,
  Container,
  Heading,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import NftCard from "../components/property/NftCard";
import NftCollection from "../components/property/NftCollection";
import { useGetAllListings } from "../hooks/marketplace/useListing";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Nft } from "../types/listing";

import "../../../fonts/IBMPlexSansCondensed-Regular.ttf";
import "../../../fonts/IBMPlexSans-Regular.ttf";
import "../../../fonts/JosefinSans-Regular.ttf";
import "../App.css";
import { CHAIN_ID } from "../types/constant";

export default function Marketplace() {
  const { address, chain, isConnected } = useAccount();
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);
  const { isLoading, data } = useGetAllListings(address);
  const [filters, setFilters] = useState({
    bedrooms: "",
    bathrooms: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (!isLoading) {
      setNfts(data);
    }
  }, [isLoading, data]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    console.log("Filters updated to:", { ...filters, [name]: value }); // Debugging
  };

  const filteredNfts = nfts?.filter(
    (nft) =>
      (filters.bedrooms === "" ||
        nft.pinataContent.bedrooms === parseInt(filters.bedrooms)) &&
      (filters.bathrooms === "" ||
        nft.pinataContent.bathrooms === parseInt(filters.bathrooms)) &&
      (filters.city === "" ||
        nft.pinataContent.city
          .toLowerCase()
          .includes(filters.city.toLowerCase())) &&
      (filters.state === "" ||
        nft.pinataContent.state
          .toLowerCase()
          .includes(filters.state.toLowerCase())) &&
      (filters.zipCode === "" ||
        nft.pinataContent.zipCode.includes(filters.zipCode))
  );

  // Wrong network
  if (isConnected && chain?.id !== CHAIN_ID) {
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
            Connect to polygon mumbai testnet!
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
    <Box className = 'font-body'>
      <Container maxWidth="container.lg" my={5} >
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
        <SimpleGrid columns={{ base: 1, sm: 4 }} spacing={3} my={5}>
          <FormControl>
            <FormLabel>Bedrooms</FormLabel>
            <Input
              name="bedrooms"
              onChange={handleFilterChange}
              placeholder="Filter by Bedrooms"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>City</FormLabel>
            <Input
              name="city"
              onChange={handleFilterChange}
              placeholder="Filter by City"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>

          <FormControl w="200px" mr={2}>
            <FormLabel>State</FormLabel>
            <Input
              name="state"
              onChange={handleFilterChange}
              placeholder="Filter by State"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Zip Code</FormLabel>
            <Input
              name="zipCode"
              onChange={handleFilterChange}
              placeholder="Filter by Zip Code"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>
        </SimpleGrid>

        <NftCollection>
          {filteredNfts?.map((nft, i) => (
            <NftCard
              key={i}
              propertyId={nft.property.propertyId}
              beds={nft.pinataContent.bedrooms}
              baths={nft.pinataContent.bathrooms}
              streetAddress={nft.pinataContent.streetAddress}
              price={nft?.property.price.toFixed(2).toString()}
              imageUrl={
                nft.pinataContent.images[0]
                  ? `${process.env.VITE_PINATA_GATEWAY}/ipfs/${
                      nft.pinataContent.images[0]
                    }`
                  : ""
              }
              bidders={nft.listing?.bids?.length}
            />
          ))}
        </NftCollection>
      </Container>
    </Box>
  );
}
