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
  Tooltip,
  IconButton,
  HStack
} from "@chakra-ui/react";

import { useRemoveBid } from "../../hooks/marketplace/useBidding";

import {
  VscAccount,
  VscChromeClose,
  VscCheck,
  VscArrowRight,
  VscArrowLeft,
} from "react-icons/vsc";

interface Props {
  address: `0x${string}`;
  nft: Nft;
}

export default function BiddingPool({ nft, address }: Props) {
  const acceptOffer = useAcceptOffer();
  const isOwner = nft.owner === address;
  const isAccepted = nft.listing?.acceptedBid?.bidPrice !== 0;
  const removeBid = useRemoveBid()
  

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
                <Th>Actions</Th>
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
                  <Td >
                    <HStack>
                      <Tooltip label="Accept" fontSize="sm">
                        <IconButton
                          colorScheme="green"
                          size="xs"
                          aria-label="Accept"
                          icon={<VscCheck />}
                          isDisabled={isAccepted}
                          onClick={() =>
                            acceptOffer.mutate({
                              address,
                              id: nft.property.propertyId,
                              bidder: bid.bidder,
                            })
                          }
                        />
                      </Tooltip>

                      <Tooltip label="Remove" fontSize="sm">
                        <IconButton
                          colorScheme="red"
                          icon={<VscChromeClose />}
                          aria-label="Reject"
                          size = 'xs'
                          isDisabled={isAccepted}
                          onClick={() => {
                            removeBid.mutate({
                              address,
                              id: nft.property.propertyId,
                              bidder: bid.bidder,
                            });
                          }}
                        />
                      </Tooltip>
                    </HStack>
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
                <Th>Actions</Th>
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
                  <Td>
                  <Tooltip label="Remove" fontSize="sm">
                        <IconButton
                          colorScheme="red"
                          icon={<VscChromeClose />}
                          aria-label="Reject"
                          size = 'xs'
                          isDisabled={isAccepted}
                          onClick={() => {
                            removeBid.mutate({
                              address,
                              id: nft.property.propertyId,
                              bidder: bid.bidder,
                            });
                          }}
                        />
                      </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}
