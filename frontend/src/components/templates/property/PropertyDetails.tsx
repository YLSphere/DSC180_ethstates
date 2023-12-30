import { BoxCardLoader, TextLoader } from "../../animations/CustomLoader";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiChevronLeft } from "react-icons/bi";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineStar } from "react-icons/md";
import {
  useCancelForSale,
  useListForSale,
  useParticularProperty,
} from "../../../hooks/dapp/useDapp";
import { Result, ResultIndex } from "../../../types/dapp";
import { useAccount } from "wagmi";

// const PropertyDetails = () => {
//   const [selectedSize, setSelectedSize] = useState<string>("");
// 	const [selectedImage, setSelectedImage] = useState<string>("");
//   const navigate = useNavigate();
//   const toast = useToast();

//   const handleAddToCart = () => {
//     toast({
//       title: "Added to cart",
//       status: "success",
//       duration: 3000,
//       isClosable: true,
//     });
//   }

//   const handleBuyNow = () => {
//     toast({
//       title: "Buy now",
//       status: "success",
//       duration: 3000,
//       isClosable: true,
//     });
//   }

//   return (
//     <Box pt="15rem" bg="brand.white100">
//       <Box maxW="1280px" mx="auto" px="3rem">
//         <Box as="span" mb="2rem" onClick={() => navigate(-1)}>
//           <Icon as={BiChevronLeft} fontSize="3rem" cursor="pointer" />
//         </Box>

//         <SimpleGrid
//           columns={[1, 2, 2, 2]}
//           gap="4rem"
//           borderBottom="1px solid"
//           borderColor="brand.white600"
//           pb="2rem"
//         >
//           {isLoadingParticulaProductData ? (
//             <Box>
//               <BoxCardLoader h="450px" />
//               <HStack mt="2rem" spacing="2rem" mx="4rem">
//                 {Array(3)
//                   .fill(0)
//                   .map((_, idx) => (
//                     <BoxCardLoader key={idx} h="70px" />
//                   ))}
//               </HStack>
//             </Box>
//           ) : (
//             <Box>
//               <Box w="100%" borderRadius="1rem" overflow="hidden">
//                 <Image
//                   src={
//                     !selectedImage
//                       ? particularProductData?.data?.product?.image[0]
//                       : selectedImage
//                   }
//                   height={500}
//                   width={500}
//                   alt="Product Image"
//                 />
//               </Box>

//               <Flex my="2rem" w="65%" mx="auto">
//                 {particularProductData?.data?.product?.image.map(
//                   (item: string, idx: number) => (
//                     <Box
//                       key={idx}
//                       onClick={() => setSelectedImage(item)}
//                       p=".8rem 1.5rem"
//                       fontSize="1.5rem"
//                       fontWeight="500"
//                       bg="transparent"
//                       border="1px solid"
//                       cursor="pointer"
//                       borderColor={
//                         selectedImage === item ? "brand.grey300" : "transparent"
//                       }
//                       borderRadius=".5rem"
//                     >
//                       <Image
//                         src={item}
//                         height={70}
//                         width={70}
//                         alt="Product Image"
//                       />
//                     </Box>
//                   )
//                 )}
//               </Flex>
//             </Box>
//           )}

//           {isLoadingParticulaProductData ? (
//             <Box>
//               <TextLoader noOfLines={2} />
//               <TextLoader mt="4rem" noOfLines={4} />
//               <TextLoader mt="4rem" noOfLines={4} />
//               <HStack mt="4rem">
//                 <BoxCardLoader h="40px" />
//                 <BoxCardLoader h="40px" />
//               </HStack>
//             </Box>
//           ) : (
//             <Box>
//               <Text
//                 fontSize={["2.5rem", "3.2rem", "2.5rem", "3.2rem"]}
//                 fontWeight="600"
//               >
//                 {particularProductData?.data?.product?.name}
//               </Text>
//               <Flex
//                 align="center"
//                 justify="space-between"
//                 borderBottom="1px solid"
//                 borderColor="brand.white600"
//                 pb="2rem"
//               >
//                 <Flex
//                   align="center"
//                   fontSize={["1.5rem", "1.8rem"]}
//                   color="brand.gold100"
//                   mt=".8rem"
//                 >
//                   {Array(5)
//                     .fill(0)
//                     .map((_, idx) => (
//                       <Icon key={idx} cursor="pointer" as={MdOutlineStar} />
//                     ))}

//                   <Text ml="1rem">4.8</Text>
//                 </Flex>

//                 <Icon
//                   cursor="pointer"
//                   color={
//                     particularProductData?.data?.product?.isFavorite
//                       ? "brand.red100"
//                       : "brand.grey400"
//                   }
//                   fontSize="2rem"
//                   as={
//                     particularProductData?.data?.product?.isFavorite
//                       ? GoHeartFill
//                       : GoHeart
//                   }
//                 />
//               </Flex>

//               <Box>
//                 <Text
//                   color="brand.blue100"
//                   fontSize={["2.5rem", "4.2rem", "2.5rem", "4.2rem"]}
//                   fontWeight="600"
//                 >
//                   ₦{particularProductData?.data?.product?.price}
//                 </Text>
//                 <Text
//                   color="brand.grey300"
//                   fontSize={["1.5rem", "1.5rem", "1.5rem", "1rem"]}
//                   fontWeight="300"
//                 >
//                   Shipping: N2,800
//                 </Text>

//                 <Box mt="2rem">
//                   <Text
//                     fontSize={["1.6rem", "1.8rem", "1.5rem", "1.8rem"]}
//                     fontWeight="600"
//                     color="brand.grey300"
//                   >
//                     Size
//                   </Text>
//                   <HStack spacing={4} mt="1rem">
//                     {["sm", "md", "lg", "xl", "2xl", "3xl"].map((size) => (
//                       <Tag
//                         onClick={() => setSelectedSize(size)}
//                         cursor="pointer"
//                         size="lg"
//                         key={size}
//                         p={[".8rem", ".8rem 1.5rem"]}
//                         fontSize={["1.5rem", "1.5rem", "1.2rem", "1.5rem"]}
//                         fontWeight="500"
//                         bg="transparent"
//                         border="1px solid"
//                         borderColor={
//                           selectedSize === size
//                             ? "brand.grey300"
//                             : "brand.white500"
//                         }
//                         borderRadius=".5rem"
//                         _hover={{
//                           borderColor: "brand.grey300",
//                         }}
//                       >
//                         {size}
//                       </Tag>
//                     ))}
//                   </HStack>
//                 </Box>

//                 <Box mt="2rem">
//                   <Text
//                     fontSize={["1.6rem", "1.8rem", "1.5rem", "1.8rem"]}
//                     fontWeight="600"
//                     color="brand.grey300"
//                   >
//                     Product Details
//                   </Text>
//                   <Text fontSize={["1.5rem", "1.5rem", "1.3rem", "1.5rem"]}>
//                     {particularProductData?.data?.product?.desc}
//                   </Text>
//                   <HStack w="100%" gap="1rem">
//                     <Box w="100%" onClick={handleAddToCart}>
//                       <CustomButton
//                         {...{
//                           text: "Add to cart",
//                           btnIcon: AiOutlineShoppingCart,
//                           py: ["2rem", "2.5rem"],
//                           bg: "transparent",
//                           color: "brand.green300",
//                           boxShadow: "0",
//                           border: ".2rem solid",
//                           borderColor: "brand.green300",
//                           fontSize: ["1.5rem", "1.8rem", "1.6rem", "1.8rem"],
//                           bgHover: "brand.white300",
//                           isBtnIcon: true,
//                         }}
//                       />
//                     </Box>

//                     <Box w="100%" onClick={handleBuyNow}>
//                       <CustomButton
//                         {...{
//                           text: "Buy Now",
//                           py: ["2rem", "2.5rem"],
//                           border: ".2rem solid",
//                           borderColor: "transparent",
//                         }}
//                       />
//                     </Box>
//                   </HStack>
//                 </Box>
//               </Box>
//             </Box>
//           )}
//         </SimpleGrid>
//       </Box>
//     </Box>
//   );
// };

interface Props {
  address: `0x${string}` | undefined;
  id: number | undefined;
}

const PropertyDetails = (props: Props) => {
  const toast = useToast();
  const { id, address } = props;
  const { isConnected } = useAccount();
  const { isLoading, data } = useParticularProperty(address, id);
  const [result, setResult] = useState<Result | undefined>();
  const listForSale = useListForSale();
  const cancelForSale = useCancelForSale();

  useEffect(() => {
    if (isConnected && !isLoading) {
      console.log(data);
      setResult(data);
    }
  }, [isConnected, isLoading, data]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (listForSale.isLoading) {
      toast({
        status: "loading",
        title: "Property NFT pending to be listed",
        description: "Please wait",
      });
    }

    // When the mutation fails, show a toast
    if (listForSale.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be listed",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (listForSale.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT listed",
        description: "Looks great",
        duration: 5000,
      });
    }
  }, [listForSale.isLoading, listForSale.isError, listForSale.isSuccess]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (cancelForSale.isLoading) {
      toast({
        status: "loading",
        title: "Property NFT pending to be removed from sale",
        description: "Please wait",
      });
    }

    // When the mutation fails, show a toast
    if (cancelForSale.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be removed from sale",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (cancelForSale.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT removed from sale",
        description: "Looks great",
        duration: 5000,
      });
    }
  }, [cancelForSale.isLoading, cancelForSale.isError, cancelForSale.isSuccess]);

  return (
    <Box>
      {result ? (
        <Box>
          <Text>{`Price: ${result?.[ResultIndex.PRICE]}`}</Text>
          <Text>{`Property ID: ${result?.[ResultIndex.PROPERTY_ID]}`}</Text>
          <Text>{`URI: ${result?.[ResultIndex.URI]}`}</Text>
          <Text>{`Buyer: ${result?.[ResultIndex.BUYER]}`}</Text>
          <Text>{`Want to sell? ${result?.[ResultIndex.WANT_SELL]}`}</Text>
          {result[ResultIndex.WANT_SELL] ? (
            <Button onClick={() => cancelForSale.mutate({ address, id })}>
              Remove From Sale
            </Button>
          ) : (
            <Button onClick={() => listForSale.mutate({ address, id })}>
              List For Sale
            </Button>
          )}
        </Box>
      ) : (
        <Text>Nothin for now</Text>
      )}
    </Box>
  );
};

export { PropertyDetails };
