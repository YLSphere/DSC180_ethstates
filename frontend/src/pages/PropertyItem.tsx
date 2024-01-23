import { Box, Container, Spinner, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { PropertyDetails } from "../components/templates/property/PropertyDetails";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useParticularProperty } from "../hooks/dapp/useDapp";
import { Nft } from "../types/dapp";

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;
  const { address, isConnected } = useAccount();
  const { isLoading, data } = useParticularProperty(address, id);
  const [nft, setNft] = useState<Nft | undefined>();

  useEffect(() => {
    if (isConnected && !isLoading) {
      console.log(data);
      setNft(data);
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
        <Container maxWidth="container.lg">
          <h1>Hello, Property Item {id.toString()} Page!</h1>

          {isConnected ? (
            <PropertyDetails id={id} address={address} nft={nft} />
          ) : (
            <Text>Connect to your wallet first!</Text>
          )}
        </Container>
      )}
    </main>
  );
}
