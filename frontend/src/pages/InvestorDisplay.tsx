import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import {Box, SimpleGrid ,Text, Link, Button ,VStack, Heading} from '@chakra-ui/react';


interface Investor {
    id: string;
    companyName: string;
    maxFinance: string;
    aprRange: string;
    tenureRange: string;
    companyWebsite: string;
  }

const DisplayInvestors = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);

  useEffect(() => {
    const fetchInvestors = async () => {
        const querySnapshot = await getDocs(collection(firestore, "Investor_data"));
        const fetchedInvestors = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Investor[]; // Ensure the mapped objects match the `Investor` type
        setInvestors(fetchedInvestors);
      };
  
      fetchInvestors();
    }, []);

  return (
        <Box padding="5" maxWidth="1200px" margin="auto">
          <Heading as="h1" size="xl" textAlign="center" my="5">
            Investor Options
          </Heading>
          <SimpleGrid columns={[1, null, 3]} spacing="40px">
            {investors.map((investor) => (
              <Box
                key={investor.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p="6"
              >
                <VStack align="stretch" spacing="4">
                  <Heading as="h2" size="md">
                    {investor.companyName}
                  </Heading>
                  <Text>Max Finance: {investor.maxFinance}</Text>
                  <Text>APR Range: {investor.aprRange}</Text>
                  <Text>Tenure Range: {investor.tenureRange}</Text>
                  <Link href={investor.companyWebsite} isExternal color="teal.500">
                    Visit Website
                  </Link>
                  <Button colorScheme="teal" size="sm">
                    Apply Now
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      );
};

export default DisplayInvestors;
