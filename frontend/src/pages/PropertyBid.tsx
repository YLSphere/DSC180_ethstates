import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Center,
  FormControl,
  FormLabel,
  Spinner,
  VStack,
  HStack,
  Input,
  FormHelperText,
  FormErrorMessage,
  useToast,
  Switch,
} from "@chakra-ui/react";
import ReactModal from "react-modal";
import Slideshow from "../Slideshow";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useParticularProperty } from "../hooks/marketplace/useProperty";
import { useBid } from "../hooks/marketplace/useBidding";
import { BidResultIndex, Nft } from "../types/listing";
import { getMarketplaceContract } from "../queries/dapp";

import { BidMenu } from "../Modals/BidMenu";

ReactModal.setAppElement("body");

const colors = {
  brand: {
    50: "#ecefff",
    100: "#cbceeb",
    200: "#a9aed6",
    300: "#888ec5",
    400: "#666db3",
    500: "#4d5499",
    600: "#3c4178",
    700: "#2a2f57",
    800: "#181c37",
    900: "#080819",
  },
};
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ colors, config });

export default function PropertyItem() {
  const locationHere = useLocation();
  const [alertIsOpen, setIsOpenAlert] = useState(false);

  const bidSubmit = useBid();

  const toast = useToast();
  const id = locationHere.state.id;

  const [price, setPrice] = useState(0);
  const isError = price <= 0;

  const { address, isConnected } = useAccount();
  const { isFetched, data } = useParticularProperty(address, id);

  const [nft, setNft] = useState<Nft | undefined>();

  useEffect(() => {
    if (isConnected && isFetched) {
      setNft(data);
    }
  }, [isConnected, isFetched]);

  async function offerListener() {
    const dapp = await getMarketplaceContract(address);
    dapp.on("Offer", (bidder, propertyId, bidPrice) => {
      if (id == propertyId) {
        console.log("offer", bidder, propertyId, bidPrice);
      }
    });
  }
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };
  const handleSubmit = () => {
    // Submit bid to bid menu
    bidSubmit.mutate({ address, id, bidPrice: price });
  };

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (bidSubmit.isPending) {
      toast({
        status: "loading",
        title: "Sending Bid...",
        description: "Please confirm on Metamask.",
      });
    }

    // When the mutation fails, show a toast
    if (bidSubmit.isError) {
      toast({
        status: "error",
        title: "An error occured",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (bidSubmit.isSuccess) {
      toast({
        status: "success",
        title: "Bid Submitted",
        description: "Looks great",
        duration: 5000,
      });
      window.setTimeout(function () {
        location.reload();
      }, 7000);
    }
  }, [bidSubmit]);
  useEffect(() => {
    if (isConnected) {
      offerListener();
    }
  }, [isConnected]);

  // TERMS AND CONDITIONS MODAL

  function closeModalAlert() {
    setIsOpenAlert(false);
  }

  const handleSwitchChange = () => {
    setIsOpenAlert(!alertIsOpen);
    handleSubmit();
  };
  function openModalAlert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpenAlert(true);
  }

  return (
    <main>
      {!isFetched ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <Spinner size="xl" color="green" />
        </Box>
      ) : (
        <Center>
          {nft ? (
            <VStack maxW="100%" flex="1">
              <ReactModal
                shouldCloseOnOverlayClick={true}
                style={customStyles}
                isOpen={alertIsOpen}
                onRequestClose={closeModalAlert}
                closeTimeoutMS={500}
                contentLabel="tas"
              >
                <Text>
                  I agree that I do not have inside information and stuff
                </Text>
                <Switch
                  colorScheme="teal"
                  isRequired
                  isChecked={!alertIsOpen}
                  onChange={handleSwitchChange}
                ></Switch>
              </ReactModal>

              <HStack>
                <Box flex="1" maxW="100%" mt={4} mb={10} mr={4}>
                  <ChakraProvider theme={theme}>
                    <Slideshow images={nft.pinataContent.images} />
                  </ChakraProvider>
                </Box>

                <VStack>
                  <Box>
                    <Text fontSize="2xl" mb={2}>
                      {" "}
                      Property Details
                    </Text>
                    <Text>{`Price: ${nft?.property.price}`}</Text>
                    <Text>{`Property ID: ${nft?.property.propertyId}`}</Text>
                    <Text>{`URI: ${nft?.property.uri}`}</Text>
                    <Text>{`Buyer: ${
                      nft?.listing?.acceptedBid?.bidder
                    }`}</Text>

                    {nft?.owner != address && nft?.listing?.sellerApproved == false ? (
                      <form onSubmit={openModalAlert}>
                        <FormControl
                          isRequired={true}
                          isInvalid={isError}
                          id="price"
                        >
                          <FormLabel>Bid Price:</FormLabel>
                          <Input
                            placeholder={"Example Bid: 999"}
                            onChange={handlePriceChange}
                            type="number"
                            value={price}
                          />
                          {!isError ? (
                            <FormHelperText>
                              Enter your bid value.
                            </FormHelperText>
                          ) : (
                            <FormErrorMessage>
                              A valid price is required.
                            </FormErrorMessage>
                          )}
                          <Button type="submit" colorScheme="teal">
                            Place Bid
                          </Button>
                        </FormControl>
                      </form>
                    ) : nft?.listing?.sellerApproved == true ? (
                      <Text mt={4}>
                        The property is in the process of transaction or is
                        sold.
                      </Text>
                    ) : (
                      <Text></Text>
                    )}
                  </Box>
                </VStack>
              </HStack>

              <Box w="100%">
                <ChakraProvider theme={theme}>
                  <BidMenu id={id} address={address} nft={nft} />
                </ChakraProvider>
              </Box>
            </VStack>
          ) : (
            <Text>Nothin for now</Text>
          )}
        </Center>
      )}
    </main>
  );
}
