import { Box, Container, Spinner, Text, Image } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { PropertyDetails } from "../components/templates/property/PropertyDetails";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useParticularProperty } from "../hooks/dapp/useProperty";
import { Nft } from "../types/dapp";
import { initializeDapp } from "../queries/dapp";

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;

  const { address, isConnected } = useAccount();
  const { isFetched, data } = useParticularProperty(address, id);
  const [nft, setNft] = useState<Nft | undefined>();

  useEffect(() => {
    if (isConnected && isFetched) {
      setNft(data);
    }
  }, [isConnected, isFetched]);

  async function offerListener() {
    const dapp = await initializeDapp(address);
    dapp.on("Offer", (bidder, propertyId, bidPrice) => {
      if (id == propertyId) {
        console.log("offer", bidder, propertyId, bidPrice);
      }
    });
  }

  useEffect(() => {
    if (isConnected) {
      offerListener();
    }
  }, [isConnected]);

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
      ) : (
        <Container maxWidth="container.lg">
          {/* <h1>Hello, Property Item {id.toString()} Page!</h1> */}
          
          {isConnected ? (
            <PropertyDetails
              id={id}
              address={address}
              nft={nft}
              isOwner={address == nft?.owner}
            />
          ) : (
            <Text>Connect to your wallet first!</Text>
          )}
        </Container>
      )}
    </main>
  );
}
