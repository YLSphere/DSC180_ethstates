import {
  Container,
  Spinner,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
} from "@chakra-ui/react";
import { useGetAllListings } from "../hooks/marketplace/useListing";
import { useAccount } from "wagmi";
import React, { useEffect, useState } from "react";
import { Nft } from "../types/listing";
import { CHAIN_ID } from "../types/constant";


export default function Investors() {
  const { address, chain, isConnected } = useAccount();
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);
  const { isLoading, data } = useGetAllListings(address);
  const [rate, setRate] = useState<number>(5);
  const [durationMonth, setDurationMonth] = useState<number>(12);

  useEffect(() => {
    if (!isLoading) {
      setNfts(data);
    }
  }, [isLoading, data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // todo
  }

    const formatRate = (value:number)=> {
        return value + '%';
    }

    const parseRate = (valueString: string) => {
        return parseFloat(valueString.replace("%", ""))
    }

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

  // NFTs are loading
  if (isLoading) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
          maxWidth="container.lg"
        >
          <Spinner size="xl" color="green" />
        </Container>
      </main>
    );
  }


  // NFTs are loaded
  return (
      <main>
        <Container maxWidth={"container.md"}>
          <form onSubmit={handleSubmit}>
            <FormControl id="rate" isRequired mt={3}>
              <FormLabel>Annual interest rate</FormLabel>
              <NumberInput
                  onChange={(valueString) => setRate(parseRate(valueString))}
                  value={formatRate(rate)}
                  min={0}
                  max={100}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl id="duration" isRequired mt={3}>
              <FormLabel>Max Duration in Month</FormLabel>
              <NumberInput
                  defaultValue={12}
                  precision={0}
                  max={360}
                  min={12}
                  onChange={(value)=>setDurationMonth(parseInt(value))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Button my={4} colorScheme="teal" type="submit">
              Submit
            </Button>
          </form>
        </Container>
      </main>
  );
}
