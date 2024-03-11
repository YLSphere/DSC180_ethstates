import { Box, Badge, Image, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaEthereum } from "react-icons/fa";
import {Loaner} from "../../types/financing";

export default function LoanerCard(props: Loaner) {
  const { address, loanerName, loanerId, annualInterestRate, maxMonths } =
    props;
  const loaner = {
    loanerId: loanerId || 0,
    address: address || "0x0000000",
    loanerName: loanerName || "Papa smurf",
    annualInterestRate: annualInterestRate || 4,
    maxMonths: maxMonths || 12
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      {/* <Box overflow="hidden" height="200px">
        <Link to="/property" state={{ id: propertyId }}>
          <Image
            src={property.imageUrl}
            alt={property.imageAlt}
            draggable={false}
          />
        </Link>
      </Box> */}

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {loaner.maxMonths} Max Months
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          <Link to="/property" state={{ id: loanerId }}>
            {loaner.loanerName}
          </Link>
        </Box>

        <HStack spacing = '0.1rem'>
          <FaEthereum /> 
          <Text>{loaner.annualInterestRate.toString()}</Text>
        </HStack>
      </Box>
    </Box>
  );
}
