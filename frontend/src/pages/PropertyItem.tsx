import { Container, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { PropertyDetails } from "../components/templates/property/PropertyDetails";
import { useAccount } from "wagmi";

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;
  const { address, isConnected } = useAccount();


  return (
    <main>
      <Container maxWidth="container.lg">
        <h1>Hello, Property Item {id} Page!</h1>

        {isConnected ? (
          <PropertyDetails id={id} address={address} />
        ) : (
          <Text>Connect to your wallet first!</Text>
        )}
      </Container>
    </main>
  );
}
