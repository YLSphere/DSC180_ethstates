import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Button,
  Container,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useGetLoans } from "../hooks/financing/useLoan";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { CHAIN_ID } from "../types/constant";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import contractAddress from "../contracts/contract-address.json";
import financingArtifact from "../contracts/FinancingContract.json";

export function Loan() {
  let { propertyId } = useParams();
  propertyId = parseInt(propertyId);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [loanDuration, setLoanDuration] = useState<number>(0);

  const { address, chain, isConnected } = useAccount();
  const { data, isFetched } = useGetLoans(address);
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isFetched) {
      console.log(data);
    }
  }, [isFetched, data]);

  // Wallet not connected
  if (!isConnected) {
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
              Wallet not found
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please connect to your web3 wallet to continue.
            </AlertDescription>
          </Alert>
        </Container>
      </main>
    );
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
              Please connect to Polygon Mumbai Testnet to continue.
            </AlertDescription>
          </Alert>
        </Container>
      </main>
    );
  }

  return (
    <Container maxWidth="container.lg" my={5}>
      <Heading as="h1" size="xl" mt={8}>
        Loans{" "}
      </Heading>

      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Lender</Th>
              <Th>Annual Interest Rate</Th>
              <Th>Max Loan Duration (Months)</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((loan, index) => (
              <Tr key={index}>
                <Td>
                  <Avatar size="xs" src="https://bit.ly/broken-link" mr={2} />
                  {`${loan.lender.slice(0, 6)}...${loan.lender.slice(-4)}`}
                </Td>
                <Td isNumeric>{loan.annualInterestRate / 100} %</Td>
                <Td isNumeric>{loan.maxDurationInMonths}</Td>
                <Td>
                  <form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();

                      console.log(propertyId, loanAmount, loanDuration);
                      
                      // writeContract({
                      //   address: address,
                      //   abi: ,
                      //   functionName: "requestLoan",
                      //   args: [loanAmount, loanDuration],
                      // });
                    }}
                  >
                    <NumberInput
                      defaultValue={0}
                      precision={2}
                      step={0.5}
                      min={0}
                      size="xs"
                      onChange={(valueString) =>
                        setLoanAmount(parseFloat(valueString))
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <NumberInput
                      defaultValue={0}
                      precision={0}
                      step={1}
                      min={0}
                      size="xs"
                      maxW="60px"
                      onChange={(valueString) =>
                        setLoanDuration(parseInt(valueString))
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Button type="submit" colorScheme="green" size="xs">
                      Request
                    </Button>
                  </form>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
