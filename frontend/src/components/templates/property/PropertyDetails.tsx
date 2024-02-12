import {
  Box,
  Button,
  Text,
  useToast,
  Center,
  Container,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import ReactModal from "react-modal";
import { FaEthereum } from "react-icons/fa";
import "../../../style.css";

import {
  useChangePrice,
} from "../../../hooks/dapp/useListing";
import {
  useUnlist,
  useList,
} from "../../../hooks/marketplace/useListing";
import { useApproveTransferAsBuyer } from "../../../hooks/marketplace/useBidding";
import { Nft } from "../../../types/listing";

import Slideshow from "../../../Slideshow";
import { BuyMenu } from "../../../Modals/BuyMenu";
import { BidMenu } from "../../../Modals/BidMenu";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
// import { useParticularProperty } from "../../../hooks/dapp/useProperty";
import { useNavigate } from "react-router-dom";

ReactModal.setAppElement("body");
interface Props {
  id: number;
  address: `0x${string}` | undefined;
  nft: Nft | undefined;
  isOwner: boolean;
}

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
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
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

const theme = extendTheme({ colors, config });

const rootElement = document.getElementById("root");

const PropertyDetails = (props: Props) => {
  // const ethers = require('hardhat');
  const toast = useToast();
  const navigate = useNavigate();
  const { id, address, nft } = props;

  // const endBiddingProcess = useEndBiddingProcess();
  const approveTransferAsBuyer = useApproveTransferAsBuyer();

  const list = useList();
  const unlist = useUnlist();
  const changePrice = useChangePrice();

  const [modalIsOpenBuyMenu, setIsOpenBuyMenu] = useState(false);
  const [modalIsOpenBidMenu, setIsOpenBidMenu] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [sliderValue, setSliderValue] = useState(0);
  const [customPrice, setCustomPrice] = useState("");

  // ============ Toasts ============
  useEffect(() => {
    // When the mutation is loading, show a toast
    if (list.isPending) {
      toast({
        status: "loading",
        title: "Property NFT pending to be listed",
        description: "Please confirm on Metamask",
      });
    }

    // When the mutation fails, show a toast
    if (list.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be listed",
        description: "Something went wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (list.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT listed",
        description: "Looks great!",
        duration: 5000,
      });
      window.setTimeout(function () {
        location.reload();
      }, 5000);
    }
  }, [list.isPending, list.isError, list.isSuccess]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (unlist.isPending) {
      toast({
        status: "loading",
        title: "Property NFT pending to be removed from sale",
        description: "Please confirm on Metamask",
      });
    }

    // When the mutation fails, show a toast
    if (unlist.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected to be removed from sale",
        description: "Something went wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (unlist.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT removed from sale",
        description: "Looks great!",
        duration: 5000,
      });
      window.setTimeout(function () {
        location.reload();
      }, 5000);
    }
  }, [unlist.isPending, unlist.isError, unlist.isSuccess]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (approveTransferAsBuyer.isPending) {
      toast({
        status: "loading",
        title: "Initiating transfer...",
        description: "Please confirm on Metamask.",
      });
    }

    // When the mutation fails, show a toast
    if (approveTransferAsBuyer.isError) {
      toast({
        status: "error",
        title: "An error occured",
        description: "Something went wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (approveTransferAsBuyer.isSuccess) {
      toast({
        status: "success",
        title: "Transfer complete",
        description: "You now own this property!",
        duration: 10000,
      });

      window.setTimeout(function () {
        location.reload();
      }, 10000);
    }
  }, [
    approveTransferAsBuyer.isPending,
    approveTransferAsBuyer.isError,
    approveTransferAsBuyer.isSuccess,
  ]);

  // useEffect(() => {
  //   // When the mutation is loading, show a toast
  //   if (endBiddingProcess.isPending) {
  //     toast({
  //       status: "loading",
  //       title: "Ending the transaction process",
  //       description: "Please confirm on Metamask.",
  //     });
  //   }

  //   // When the mutation fails, show a toast
  //   if (endBiddingProcess.isError) {
  //     toast({
  //       status: "error",
  //       title: "An error occured",
  //       description: "Something went wrong",
  //       duration: 5000,
  //     });
  //   }

  //   // When the mutation is successful, show a toast
  //   if (endBiddingProcess.isSuccess) {
  //     toast({
  //       status: "success",
  //       title: "Ended transaction process",
  //       description: "Looks great!",
  //       duration: 10000,
  //     });
  //     window.setTimeout(function(){location.reload()},10000);
  //   }
  // }, [endBiddingProcess.isPending, endBiddingProcess.isError, endBiddingProcess.isSuccess]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (changePrice.isPending) {
      toast({
        status: "loading",
        title: "Changing Price of property",
        description: "Please confirm on Metamask",
      });
    }

    // When the mutation fails, show a toast
    if (changePrice.isError) {
      toast({
        status: "error",
        title: "Price not changed",
        description: "Something went wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (changePrice.isSuccess) {
      toast({
        status: "success",
        title: "Price changed successfully",
        description: "Looks great!",
        duration: 5000,
      });
      window.setTimeout(function () {
        location.reload();
      }, 5000);
    }
  }, [changePrice.isPending, changePrice.isError, changePrice.isSuccess]);

  // ============ Buying ============

  // ============ Modals and component helper functions ============

  ReactModal.setAppElement(rootElement);
  function openModalBuyMenu() {
    setIsOpenBuyMenu(true);
  }
  function closeModalBuyMenu() {
    setIsOpenBuyMenu(false);
  }

  function openModalBidMenu() {
    setIsOpenBidMenu(true);
  }
  function closeModalBidMenu() {
    setIsOpenBidMenu(false);
  }

  const updateSlider = (value: number) => {
    setSliderValue(value);
  };
  const debouncedUpdateSlider = debounce(updateSlider, 300);

  function priceChangeInput(event) {
    if (event.target.value == "") {
      setCustomPrice("");
      setSliderValue(0);
    } else {
      setCustomPrice(event.target.value);
      debouncedUpdateSlider(event.target.value);
    }
  }

  // ============ Bidding ============

  const linkToBidPage = () => {
    // Navigate to bid page
    navigate("/property/bids", { state: { id: nft?.property.propertyId } });
  };

  return (
    <Container maxW="800px">
      <ReactModal
        shouldCloseOnOverlayClick={true}
        style={customStyles}
        isOpen={modalIsOpenBuyMenu}
        onRequestClose={closeModalBuyMenu}
        closeTimeoutMS={500}
        contentLabel="buyMenu"
      >
        <div>
          <ChakraProvider theme={theme}>
            <BuyMenu />
          </ChakraProvider>
        </div>
      </ReactModal>

      <ReactModal
        shouldCloseOnOverlayClick={true}
        style={customStyles}
        isOpen={modalIsOpenBidMenu}
        onRequestClose={closeModalBidMenu}
        closeTimeoutMS={500}
        contentLabel="bidMenu"
      >
        <div>
          <ChakraProvider theme={theme}>
            <BidMenu id={id} address={address} nft={nft} />
          </ChakraProvider>
        </div>
      </ReactModal>

      <Center>
        {nft ? (
          <Box maxW="800px" mt={4}>
            <ChakraProvider theme={theme}>
              <Slideshow images={nft.pinataContent.images} />
            </ChakraProvider>

            <HStack spacing="0.1rem" mt={5}>
              <FaEthereum size={30} />
              <Text fontSize="2xl">{nft?.property.price.toString()}</Text>
              <Box ml={2}>
                {nft?.owner == address && (
                  <Button
                    ref={btnRef}
                    size="sm"
                    colorScheme="blue"
                    onClick={onOpen}
                  >
                    Change Price
                  </Button>
                )}
              </Box>
            </HStack>
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
              size="sm"
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Change Price</DrawerHeader>
                <DrawerBody>
                  <Slider
                    defaultValue={0}
                    min={0}
                    max={nft?.property.price * 2}
                    onChange={(v) => {
                      setSliderValue(v);
                      setCustomPrice(v.toString());
                    }}
                    value={sliderValue}
                  >
                    <SliderTrack bg="red.100">
                      <SliderFilledTrack bg="teal" />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                  <HStack>
                    <FaEthereum size={40} />
                    <Text fontSize={40}>{sliderValue.toString()} </Text>
                  </HStack>
                  <Input
                    type="number"
                    onChange={priceChangeInput}
                    value={customPrice}
                  />
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      changePrice.mutate({
                        address,
                        id,
                        sellPrice: sliderValue,
                      });
                      onClose;
                    }}
                  >
                    Change
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Text fontSize="2xl" mb={2}>
              Property Details
            </Text>

            <Text>{`Property ID: ${nft?.property.propertyId}`}</Text>
            <Text>{`URI: ${nft?.property.uri}`}</Text>
            <Text>{`Buyer: ${nft?.listing?.acceptedBid?.bidder}`}</Text>
            {nft?.owner == address && nft?.listing?.sellerApproved == false ? (
              <Box>
                {nft?.listing?.propertyId === nft?.property.propertyId ? (
                  <Button onClick={() => unlist.mutate({ address, id })}>
                    Remove From Sale
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      list.mutate({ address, id })
                    }
                  >
                    List For Sale
                  </Button>
                )}
              </Box>
            ) : nft?.listing?.sellerApproved == true ? (
              <Text mt={4}>
                The property is in the process of transaction or is sold.
              </Text>
            ) : (
              <Text mt={4}></Text>
            )}
          </Box>
        ) : (
          <Text>Nothin for now</Text>
        )}
      </Center>
      <Center>
        {nft?.owner != props.address &&
          nft?.listing?.sellerApproved == false && ( // CHANGE == to != FOR DEPLOYMENT
            <Container>
              <Button colorScheme="teal">Buy Now! Implement later</Button>
              <Button colorScheme="red" onClick={linkToBidPage}>
                Bid
              </Button>
            </Container>
          )}
        {nft?.owner == props.address && nft?.listing?.sellerApproved == false && (
          <Container>
            <Button colorScheme="teal" onClick={openModalBuyMenu}>
              Buy Offers
            </Button>
            <Button colorScheme="red" onClick={openModalBidMenu}>
              Bid Offers
            </Button>
          </Container>
        )}
        <VStack>
          {nft?.listing?.sellerApproved == true &&
            props.address == nft?.listing?.acceptedBid?.bidder && (
              // ethers.parseEther(.toString())
              <Button
                colorScheme="green"
                onClick={() =>
                  approveTransferAsBuyer.mutate({
                    address,
                    id,
                    bidPrice:
                      BigInt(nft!.listing!.acceptedBid!.bidPrice) *
                      BigInt(1e18),
                  })
                }
              >
                Confirm transaction and initiate transfer
              </Button>
            )}
          {/* {nft?.listing?.sellerApproved == true &&
            (nft?.owner == props.address ||
              nft?.listing?.acceptedBid?.bidder == props.address) && (
              <Button
                colorScheme="red"
                onClick={() => endBiddingProcess.mutate({ address, id })}
              >
                End transaction process
              </Button>
            )} */}
        </VStack>
      </Center>
    </Container>
  );
};

export { PropertyDetails };
