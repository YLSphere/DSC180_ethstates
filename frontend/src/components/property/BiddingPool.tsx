import { useAcceptOffer } from "../../hooks/marketplace/useBidding";
import { Nft } from "../../types/listing";
import {
  Box,
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
} from "@chakra-ui/react";

interface Props {
  address: `0x${string}`;
  nft: Nft;
}

export default function BiddingPool({ nft, address }: Props) {
  const acceptOffer = useAcceptOffer();
  const isOwner = nft.owner === address;
  const isAccepted = nft.listing?.acceptedBid?.bidPrice !== 0;

  if (isOwner) {
    return (
      <Box mt={5}>
        <Text fontSize="2xl" mb={2}>
          Bidding Pool
        </Text>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Bidder</Th>
                <Th isNumeric>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {nft.listing?.bids?.map((bid, index) => (
                <Tr key={index}>
                  <Td display="flex" alignItems="center">
                    {bid.bidder}
                    {nft.listing?.acceptedBid?.bidder === bid.bidder ? (
                      <Badge variant="solid" colorScheme="green" ml={2}>
                        Accepted Bid
                      </Badge>
                    ) : (
                      <></>
                    )}
                  </Td>
                  <Td isNumeric>{bid.bidPrice}</Td>
                  <Td>
                    <Button
                      colorScheme="green"
                      size="xs"
                      isDisabled={isAccepted}
                      onClick={() =>
                        acceptOffer.mutate({
                          address,
                          id: nft.property.propertyId,
                          bidder: bid.bidder,
                        })
                      }
                    >
                      Accept
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  } else {
    return (
      <Box mt={5}>
        <Text fontSize="2xl" mb={2}>
          Bidding Pool
        </Text>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Bidder</Th>
                <Th isNumeric>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {nft.listing?.bids?.map((bid, index) => (
                <Tr key={index}>
                  <Td display="flex" alignItems="center">
                    {bid.bidder}
                    {nft.listing?.acceptedBid?.bidder === bid.bidder ? (
                      <Badge variant="solid" colorScheme="green" ml={2}>
                        Accepted Bid
                      </Badge>
                    ) : (
                      <></>
                    )}
                    {address === bid.bidder ? (
                      <Badge variant="solid" colorScheme="blue" ml={2}>
                        You
                      </Badge>
                    ) : (
                      <></>
                    )}
                  </Td>
                  <Td isNumeric>{bid.bidPrice}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}
