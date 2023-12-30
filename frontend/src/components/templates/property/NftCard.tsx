import { Box, Badge, Image, Skeleton, SkeletonText } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Props {
  h?: string | string[];
  isLoading?: boolean;
  propertyId?: number;
  beds?: number;
  baths?: number;
  streetAddress?: string;
  formattedPrice?: string;
  imageUrl?: string;
}

export default function NftCard(props: Props) {
  const {
    h,
    isLoading,
    propertyId,
    beds,
    baths,
    streetAddress,
    formattedPrice,
    imageUrl,
  } = props;
  const property = {
    imageUrl: imageUrl || "https://bit.ly/2Z4KKcF",
    imageAlt: "Rear view of modern home with pool",
    beds: beds || 3,
    baths: baths || 2,
    title: streetAddress || "Modern home in city center in the heart of historic Los Angeles",
    formattedPrice: formattedPrice || "$1,900.00",
    reviewCount: 34,
    rating: 4,
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Skeleton
        w="100%"
        h={h}
        isLoaded={!isLoading}
        fadeDuration={1}
        overflow="hidden"
      >
        <Link to="/property" state={{ id: propertyId }}>
          <Image
            src={property.imageUrl}
            alt={property.imageAlt}
            draggable={false}
          />
        </Link>
      </Skeleton>

      <Box p="6">
        <SkeletonText
          noOfLines={3}
          spacing="4"
          skeletonHeight="4"
          isLoaded={!isLoading}
          fadeDuration={1}
        >
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

          <Box>
            {property.formattedPrice}
            <Box as="span" color="gray.600" fontSize="sm">
              &nbsp;USD
            </Box>
          </Box>

          {/* <Box display="flex" mt="2" alignItems="center">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < property.rating ? "teal.500" : "gray.300"}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {property.reviewCount} reviews
          </Box>
        </Box> */}
        </SkeletonText>
      </Box>
    </Box>
  );
}
