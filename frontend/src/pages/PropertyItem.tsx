import {
  Box,
  Center,
  Container,
  HStack,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useParticularProperty } from "../hooks/marketplace/useProperty";
import { Nft } from "../types/listing";

import Slideshow from "../components/property/Slideshow";
import PropertyPrice from "../components/property/PropertyPrice";
import PropertyListing from "../components/property/PropertyListing";
import PropertyBidding from "../components/property/PropertyBidding";
import PropertyApproval from "../components/property/PropertyApproval";
import PropertyDetail from "../components/property/PropertyDetail";
import BiddingPool from "../components/property/BiddingPool";
import FinancingStatus from "../components/property/FinancingStatus";

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;

  const { address, isConnected } = useAccount();
  const { isFetched, data } = useParticularProperty(address, id);
  const [nft, setNft] = useState<Nft | undefined>();

  const shouldDisplay =
    nft &&
    address &&
    (nft.owner === address || // current address is the owner
      nft.listing?.propertyId === nft.property.propertyId); // or the property is listed

  useEffect(() => {
    if (isConnected && isFetched) {
      console.log(data);
      setNft(data);
    }
  }, [isConnected, isFetched]);

  return (
    <main>
      {!isFetched ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <Spinner size="xl" color="green" />
        </Box>
      ) : shouldDisplay ? (
        <Container maxW={"max-content"} my={3}>
          <Heading as="h1" size="xl" noOfLines={1} mb={3}>
            {nft.pinataContent.streetAddress}
          </Heading>

          <Center>
            <Slideshow images={nft.pinataContent.images} />
          </Center>

          <HStack mt={5}>
            <PropertyPrice address={address} nft={nft} />
            <PropertyListing address={address} nft={nft} />
            <PropertyBidding address={address} nft={nft} />
            <PropertyApproval address={address} nft={nft} />
          </HStack>

          <PropertyDetail nft={nft} />
          <BiddingPool address={address} nft={nft} />
          <FinancingStatus nft={nft} />
        </Container>
      ) : (
        <Text>Connect to your wallet first! Oops!</Text>
      )}
    </main>
  );
}
