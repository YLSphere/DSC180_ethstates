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

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;

  const { address, isConnected } = useAccount();
  const { isFetched, data } = useParticularProperty(address, id);
  const [nft, setNft] = useState<Nft | undefined>();

  const [containerHeight, setContainerHeight] = useState("100vh");
  useEffect(() => {
    function handleResize() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const newHeight = documentHeight > windowHeight ? '100%' : '100vh';
      setContainerHeight(newHeight);
    }

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    if (isConnected && isFetched) {
      setNft(data);
      setTimeout(function(){
        handleResize();
      }, 1000);
    
    }
    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [isConnected, isFetched]);

  

  const importantStyle: CSSObject = {
    maxW: 'max-content !important' ,
    my: 3,
  }

  return (
    <main style ={{height: containerHeight}}>
      {!isFetched ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" color="green" />
        </Box>
      ) : nft && address ? (
          <Container sx = {importantStyle}>
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
        <Text>Connect to your wallet first!</Text>
      )}
    </main>
  );
}
