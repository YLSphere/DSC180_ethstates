import { Container, Heading } from '@chakra-ui/react';
import NftCard from '../components/NftCard';
import NftCollection from '../components/NftCollection';

export default function Marketplace() {
  const propertyCount = 10;

  return (
    <main>
      <Container maxWidth="container.lg" my={5}>
        <Heading as="h1" size="xl" mt={8}>Marketplace</Heading>
        <NftCollection>
          {Array(propertyCount)
            .fill("")
            .map((_, i) => (
              <NftCard key={i} />
            ))}
        </NftCollection>
      </Container>
    </main>
  );
}