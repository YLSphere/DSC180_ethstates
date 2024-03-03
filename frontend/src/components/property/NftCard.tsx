import { Box, Badge, Image, HStack, Text, AspectRatio } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Polygon from "../../assets/polygon.svg";
import { FaArrowTrendUp } from "react-icons/fa6";

interface Props {
  propertyId: number;
  beds: number;
  baths: number;
  streetAddress: string;
  price: string;
  imageUrl: string;
  bidders?: number;
}

export default function NftCard(props: Props) {
  const { propertyId, beds, baths, streetAddress, price, imageUrl, bidders } =
    props;
  const property = {
    imageUrl:
      imageUrl || "https://i.ibb.co/CHQmRsx/pexels-binyamin-mellish-106399.jpg",
    imageAlt: "Rear view of modern home with pool",
    beds,
    baths,
    title: streetAddress,
    price: price,
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box overflow="hidden">
        <Link to="/property" state={{ id: propertyId }} draggable={false}>
          <AspectRatio maxW="full" ratio={16 / 9}>
            <Image
              src={property.imageUrl}
              alt={property.imageAlt}
              draggable={false}
            />
          </AspectRatio>
        </Link>
      </Box>

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
            {property.beds} beds &bull; {property.baths} baths
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          <Link to="/property" state={{ id: propertyId }}>
            {property.title}
          </Link>
        </Box>

        <HStack spacing="0.1rem">
          <Image src={Polygon} alt="logo" height={5} width={5} mr={2} />
          <Text>{property.price}</Text>
        </HStack>

        {bidders ? (
          <Box display="flex" mt="2" alignItems="center">
            <FaArrowTrendUp />
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
              {bidders} bids
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
