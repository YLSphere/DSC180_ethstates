import { Nft } from "../../types/listing";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface Props {
  nft: Nft;
}

export default function FinancingStatus({ nft }: Props) {
  if (nft.financing?.propertyId === nft.property.propertyId) {
    return (
      <Box mt={5}>
        <Text fontSize="2xl" mb={2}>
          Financing Details
        </Text>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Feature</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Loan Amount</Td>
                <Td isNumeric>{nft.financing?.loanAmount}</Td>
              </Tr>
              <Tr>
                <Td>Loan Duration</Td>
                <Td isNumeric>{nft.financing?.durationInMonths}</Td>
              </Tr>
              <Tr>
                <Td>Paid Months</Td>
                <Td isNumeric>{nft.financing?.paidMonths}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
  return <></>;
}
