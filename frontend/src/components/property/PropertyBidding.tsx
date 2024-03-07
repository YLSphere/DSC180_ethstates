import { useEffect, useState } from "react";
import { useBid } from "../../hooks/marketplace/useBidding";
import { Nft } from "../../types/listing";
import {
  Button,
  Container,
  FormControl,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  Switch,
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import ReactModal from "react-modal";

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
interface Props {
  address: `0x${string}`;
  nft: Nft;
}

export default function PropertyBidding({ nft, address }: Props) {
  const bid = useBid();
  const [isBidded, setIsBidded] = useState<boolean>(false);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [alertIsOpen, setIsOpenAlert] = useState(false);

  // TERMS AND CONDITIONS MODAL

  function closeModalAlert() {
    setIsOpenAlert(false);
  };

  const handleSwitchChange = () => {
    setIsOpenAlert(!alertIsOpen);
    bid.mutate({
      address,
      id: nft.listing?.propertyId,
      bidPrice: bidPrice
    });
  };
  function openModalAlert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpenAlert(true);
  };

  useEffect(() => {
    nft.listing?.bids?.forEach((bid) => {
      if (bid.bidder === address) {
        setIsBidded(true);
        return;
      }
    });
  }, [nft.listing?.bids, address]);

  if (
    nft.owner !== address && // not the owner
    nft.listing?.propertyId === nft.property.propertyId && // is listed
    nft.listing?.acceptedBid?.bidPrice === 0 // not accepted
  ) {
    return (
      <Container>
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
        <form
          onSubmit={openModalAlert}
        >
          <FormControl
            isDisabled={isBidded}
            maxW={"3xs"}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={3}
          >
            <InputGroup>
              <InputRightElement pointerEvents="none">
                <FaEthereum color="gray" />
              </InputRightElement>
              <NumberInput precision={2}>
                <NumberInputField
                  placeholder="Bid price"
                  onChange={(e) => setBidPrice(parseFloat(e.target.value))}
                />
              </NumberInput>
            </InputGroup>
            <Button type="submit" colorScheme="blue" isDisabled={isBidded}>
              Bid
            </Button>
          </FormControl>
        </form>
      </Container>
    );
  }

  return <></>;
}
