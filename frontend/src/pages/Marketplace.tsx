import {
  Badge,
  Container,
  Heading,
  Spinner,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Box,
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

export default function Marketplace() {
  const { address, isConnected } = useAccount();
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
    if (isConnected && !isLoading) {
      console.log(data);
      setNfts(data);
    }
  }, [isConnected, isLoading, data]);

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
        <Flex wrap="wrap" justifyContent="space-between" my={5}>
          <FormControl w="200px" mr={2}>
            <FormLabel>Bedrooms</FormLabel>
            <Input
              name="bedrooms"
              onChange={handleFilterChange}
              placeholder="Filter by Bedrooms"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>
          <FormControl w="200px" mr={2}>
            <FormLabel>City</FormLabel>
            <Input
              name="city"
              onChange={handleFilterChange}
              placeholder="Filter by City"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>

          <FormControl w="200px" mr={2} >
            <FormLabel >State</FormLabel>
            <Input
              name="state"
              onChange={handleFilterChange}
              placeholder="Filter by State"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>

          <FormControl w="200px" mr={2}>
            <FormLabel>Zip Code</FormLabel>
            <Input
              name="zipCode"
              onChange={handleFilterChange}
              placeholder="Filter by Zip Code"
              borderWidth={'2px'}
              borderColor={'gray.700'}
            />
          </FormControl>
        </Flex>

        <NftCollection>
          {filteredNfts?.map((nft, i) => (
            <NftCard
              key={i}
              propertyId={nft.property.propertyId}
              beds={nft.pinataContent.bedrooms}
              baths={nft.pinataContent.bathrooms}
              streetAddress={nft.pinataContent.streetAddress}
              price={nft?.property.price.toString()}
              imageUrl={
                nft.pinataContent.images[0]
                  ? `${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${
                      nft.pinataContent.images[0]
                    }`
                  : ""
              }
            />
          ))}
        </NftCollection>
      </Container>
    </Box>
  );
}
