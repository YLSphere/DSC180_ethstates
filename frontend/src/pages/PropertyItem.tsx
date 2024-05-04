import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Container,
  HStack,
  Heading,
  Spinner,
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
// import PropertyApproval from "../components/property/PropertyApproval";
import PropertyDetail from "../components/property/PropertyDetail";
import BiddingPool from "../components/property/BiddingPool";
import FinancingStatus from "../components/property/FinancingStatus";
import { CHAIN_ID } from "../types/constant";
import { PropertyRemoval } from "../components/property/PropertyRemoval";
import { EditButton } from "../components/property/buttons/EditButton";
import { FinancingButton } from "../components/financing/FinancingButton";

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;

  const { address, chain, isConnected } = useAccount();
  const { isFetched, data, refetch } = useParticularProperty(address, id);
  const [nft, setNft] = useState<Nft | undefined>();

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
              Please connect to Polygon Amony Testnet to continue.
            </AlertDescription>
          </Alert>
        </Container>
      </main>
    );
  }

  // Loading
  if (!nft) {
    return (
      <main>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <Spinner size="xl" color="green" />
        </Box>
      </main>
    );
  }
  
  if (shouldDisplay) {
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
            {/* <PropertyApproval address={address} nft={nft} refetch={refetch} /> */}
            <FinancingButton address={address} nft={nft} refetch={refetch} />
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
              Not Authorized
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              You're not authorized to see this NFT.
            </AlertDescription>
          </Alert>
        </Container>
      </main>
    );
  }
}
