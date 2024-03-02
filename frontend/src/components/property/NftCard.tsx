import { Box, Badge, Image, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Polygon from "./assets/polygon.svg";

interface Props {
  isLoading?: boolean;
  propertyId?: number;
  beds?: number;
  baths?: number;
  streetAddress?: string;
  price?: string;
  imageUrl?: string;
}

export default function NftCard(props: Props) {
  const { propertyId, beds, baths, streetAddress, price, imageUrl } =
    props;
  const property = {
    imageUrl: imageUrl || "https://bit.ly/2Z4KKcF",
    imageAlt: "Rear view of modern home with pool",
    beds: beds || 3,
    baths: baths || 2,
    title:
      streetAddress ||
      "Modern home in city center in the heart of historic Los Angeles",
    price: price || "$1,900.00",
    reviewCount: 34,
    rating: 4,
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box overflow="hidden" height="200px">
        <Link to="/property" state={{ id: propertyId }}>
          <Image
            src={property.imageUrl}
            alt={property.imageAlt}
            draggable={false}
          />
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

        <HStack spacing = '0.1rem'>
          <Image src={Polygon} alt="logo" height={5} width={5} mr={2}/>
          <Text>{property.price}</Text>
        </HStack>
      </Box>
    </Box>
  );
}
