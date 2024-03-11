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
import { CSSObject } from "@emotion/react";
import { useAccount } from "wagmi";
import { useEffect, useState, useRef} from "react";
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
import { CHAIN_ID } from "../types/constant";
import { PropertyRemoval } from "../components/property/PropertyRemoval";
import { EditButton } from "../components/property/buttons/EditButton";

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;

  const { address, chain, isConnected } = useAccount();
  const { isFetched, data, refetch } = useParticularProperty(address, id);
  const [nft, setNft] = useState<Nft | undefined>();

  const [containerHeight, setContainerHeight] = useState("100vh");
  const shouldDisplay =
    nft &&
    (nft.owner === address || // current address is the owner
      nft.listing?.propertyId === nft.property.propertyId); // or the property is listed

  useEffect(() => {
    if (data && isFetched) {
      setNft(data);
    }
  }, [isFetched, data]);

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

  if (!nft) {
    return (
      <main>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" color="green" />
        </Box>
      </main>
    );
  } else if (shouldDisplay) {
    return (
      <main>
        <Container maxW={"max-content"} my={3}>
          <Heading as="h1" size="xl" noOfLines={1} mb={3}>
            {nft.pinataContent.streetAddress}
          </Heading>

            <Center>
              <Slideshow images={nft.pinataContent.images} />
            </Center>

          <HStack mt={5}>
            <PropertyPrice address={address} nft={nft} refetch={refetch} />
            <PropertyListing address={address} nft={nft} refetch={refetch} />
            <PropertyBidding address={address} nft={nft} refetch={refetch} />
            <PropertyApproval address={address} nft={nft} refetch={refetch} />
            <EditButton nft={nft} address={address} refetch={refetch} />
            <PropertyRemoval address={address} nft={nft} />
          </HStack>

          <PropertyDetail nft={nft} />
          <BiddingPool address={address} nft={nft} refetch={refetch} />
          <FinancingStatus nft={nft} />
        </Container>
      </main>
    );
  } else {
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
            You are not allowed to view this property
          </Text>
        </Container>
      </main>
    );
  }
}
