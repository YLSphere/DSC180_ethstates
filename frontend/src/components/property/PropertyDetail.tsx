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

export default function PropertyDetail({ nft }: Props) {
  return (
    <Box mt={5}>
      <Text fontSize="2xl" mb={2}>
        Property Details
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
              <Td>Property ID</Td>
              <Td>{nft.property.propertyId}</Td>
            </Tr>
            <Tr>
              <Td>Street Address</Td>
              <Td>{nft.pinataContent.streetAddress}</Td>
            </Tr>
            <Tr>
              <Td>City</Td>
              <Td>{nft.pinataContent.city}</Td>
            </Tr>
            <Tr>
              <Td>State</Td>
              <Td>{nft.pinataContent.state}</Td>
            </Tr>
            <Tr>
              <Td>Zip Code</Td>
              <Td>{nft.pinataContent.zipCode}</Td>
            </Tr>
            <Tr>
              <Td>Bedrooms</Td>
              <Td isNumeric>{nft.pinataContent.bedrooms}</Td>
            </Tr>
            <Tr>
              <Td>Bathrooms</Td>
              <Td isNumeric>{nft.pinataContent.bathrooms}</Td>
            </Tr>
            <Tr>
              <Td>Parking Spots</Td>
              <Td isNumeric>{nft.pinataContent.parkingSpots}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
