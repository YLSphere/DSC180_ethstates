import { Box, Button, Text, useToast, Center, Container} from "@chakra-ui/react";
import { useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import "../../../style.css";

import {
  useCancelForSale,
  useListForSale,
  useBuyerAgreementToSale,

} from "../../../hooks/dapp/useDapp";
import { Nft } from "../../../types/dapp";

import Slideshow from "../../../Slideshow";
import ModalMenu from "../../../ModalMenu";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

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
    900: "#080819"
  }
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const theme = extendTheme({ colors, config });

const rootElement = document.getElementById("root");

const PropertyDetails = (props: Props) => {
  // const ethers = require('hardhat');
  const toast = useToast();
  const [reload, setReload] = useState(false);
  const { id, address, nft } = props;
 
  const buyerAgreementToSale = useBuyerAgreementToSale();
  const listForSale = useListForSale();
  const cancelForSale = useCancelForSale();

  const [modalIsOpenBuyMenu, setIsOpenBuyMenu] = useState(false);
  const [modalIsOpenBidMenu, setIsOpenBidMenu] = useState(false);

  
  
  useEffect(() => {
    // When the mutation is loading, show a toast
    if (list.isPending) {
      toast({
        status: "loading",
        title: "Property NFT pending to be listed",
        description: "Please wait",
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
      setReload(!reload);
    }
  }, [list]);

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (unlist.isPending) {
      toast({
        status: "loading",
        title: "Property NFT pending to be removed from sale",
        description: "Please wait",
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
      setReload(!reload);
    }
  }, [cancelForSale.isLoading, cancelForSale.isError, cancelForSale.isSuccess]);
// ============ Buying ============

useEffect(() => {
  // When the mutation is loading, show a toast
  if (buyerAgreementToSale.isLoading) {
    toast({
      status: "loading",
      title: "Agreement to buy property is pending...",
      description: "Please wait",
    });
  }

  // When the mutation fails, show a toast
  if (buyerAgreementToSale.isError) {
    toast({
      status: "error",
      title: "Agreement to buy property is rejected",
      description: "Something went wrong",
      duration: 5000,
    });
  }

  // When the mutation is successful, show a toast
  if (buyerAgreementToSale.isSuccess) {
    toast({
      status: "success",
      title: "Agreement to buy property was successful! Waiting on seller...",
      description: "Looks great!",
      duration: 5000,
    });
  }
}, [buyerAgreementToSale.isLoading, buyerAgreementToSale.isError, buyerAgreementToSale.isSuccess]);

// ============ Offer Menu ============
  
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

    return (
      
      <Container maxW = '800px'>
        <ReactModal shouldCloseOnOverlayClick = {true} style={customStyles} isOpen={modalIsOpenBuyMenu} onRequestClose={closeModalBuyMenu} closeTimeoutMS={500} contentLabel="buyMenu">
            <div className="buyOfferMenu">
              <ChakraProvider theme={theme}>
                <ModalMenu />
              </ChakraProvider>
            </div>
        </ ReactModal>

        <ReactModal shouldCloseOnOverlayClick = {true} style={customStyles} isOpen={modalIsOpenBidMenu} onRequestClose={closeModalBidMenu} closeTimeoutMS={500} contentLabel="bidMenu">
            <div className="bidOfferMenu">
              <ChakraProvider theme={theme}>
                <ModalMenu />
              </ChakraProvider>
            </div>
        </ ReactModal>
        
        <Center>
          {nft ? (
            <Box maxW = '800px' mt = {4}>
            <ChakraProvider theme={theme}>
              <Slideshow images= {nft.images}/>
            </ChakraProvider>
    
              <Text fontSize='2xl' mb = {2}> Property Details</Text> 
              <Text>{`Price: ${nft?.price}`}</Text>
              <Text>{`Property ID: ${nft?.propertyId}`}</Text>
              <Text>{`URI: ${nft?.uri}`}</Text>
              <Text>{`Buyer: ${nft?.buyer}`}</Text>
              {nft.wantSell ? (
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
          
          
        </Center>
        <Center>
          {nft?.owner == props.address && // CHANGE == to != FOR DEPLOYMENT
            <Button colorScheme='blue' onClick={() => buyerAgreementToSale.mutate({ address, id })}>
              Buy Now!
            </Button>}
          {nft?.owner == props.address &&

              <Container>
                <Button colorScheme='blue' onClick={openModalBuyMenu}>
                  Buy Offers
                </Button>
                <Button colorScheme='green' onClick={openModalBidMenu}>
                  Bid Offers
                </Button>
              </Container>
              
              }
              
        </Center>
      </Container>
    );
  };

export { PropertyDetails };