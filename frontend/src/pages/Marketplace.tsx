
import { Container, Heading, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
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
  const [filters, setFilters] = useState({
    bedrooms: '',
    bathrooms: '',
    city: '',
    state: '',
    zipCode:''
  });

  useEffect(() => {
    if (isConnected && !isLoading) {
      console.log(data);
      setNfts(data);
    }
  }, [isConnected, isLoading, data]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    console.log("Filters updated to:", { ...filters, [name]: value }); // Debugging
  };

  const filteredNfts = nfts?.filter(nft =>
    (filters.bedrooms === '' || nft.bedrooms === parseInt(filters.bedrooms)) &&
    (filters.bathrooms === '' || nft.bathrooms === parseInt(filters.bathrooms)) &&
    (filters.city === '' || nft.city.toLowerCase().includes(filters.city.toLowerCase())) &&
    (filters.state === '' || nft.state.toLowerCase().includes(filters.state.toLowerCase())) &&
    (filters.zipCode === '' || nft.zipCode.includes(filters.zipCode))

  
  );
    
  console.log("Filtered NFTs:", filteredNfts);
  return (
    <main>
      <Container maxWidth="container.lg" my={5}>
        <Heading as="h1" size="xl" mt={8}>
          Marketplace
        </Heading>
        <Flex wrap="wrap" justifyContent="space-between" my={5}>
          <FormControl w="200px" mr={2}>
            <FormLabel>Bedrooms</FormLabel>
            <Input name="bedrooms" onChange={handleFilterChange} placeholder="Filter by Bedrooms"/>
          </FormControl>
          <FormControl w="200px" mr={2}>
            <FormLabel>City</FormLabel>
            <Input name="city" onChange={handleFilterChange} placeholder="Filter by City" />
          </FormControl>

          <FormControl w="200px" mr={2}>
            <FormLabel>State</FormLabel>
            <Input name="state" onChange={handleFilterChange} placeholder="Filter by State" />
          </FormControl>

          <FormControl w="200px" mr={2}>
            <FormLabel>Zip Code</FormLabel>
            <Input name="zipCode" onChange={handleFilterChange} placeholder="Filter by Zip Code" />
          </FormControl>
          </Flex>
        <NftCollection>
          {/* Demo */}
          {/* {Array(propertyCount)
            .fill("")
            .map((_, i) => (
              <NftCard key={i} isLoading={true} />
            ))} */}

          {filteredNfts?.map((nft, i) => (
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
          ))}
        </NftCollection>
      </Container>
    </main>
  );
}
