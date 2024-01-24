import { Container, Text, Image } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { PropertyDetails } from "../components/templates/property/PropertyDetails";
import { useAccount } from "wagmi";

export default function PropertyItem() {
  const location = useLocation();
  const id = location.state.id;

  const { address, isConnected } = useAccount();

  return (
    <main>

      {/* <Image boxSize='100px' objectFit='cover' src={nft.images[0] ? `https://gateway.pinata.cloud/ipfs/${nft.images[0]}`: ""} alt='Dan Abramov'/> */}

      <Container maxWidth="container.lg">
        <h1>Hello, Property Item {id.toString()} Page!</h1>
        
        
        
        

        {isConnected ? (
          <PropertyDetails id={id} address={address} />
        ) : (
          <Text>Connect to your wallet first!</Text>
        )}
      </Container>
    </main>
  );
}
