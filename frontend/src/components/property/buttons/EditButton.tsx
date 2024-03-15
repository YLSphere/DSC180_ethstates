import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { PinataContent } from "../../../types/property";
import { Nft } from "../../../types/listing";

import contractAddress from "../../../contracts/contract-address.json";
import marketplaceArtifact from "../../../contracts/ListingContract.json";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { pinataJson } from "../../../queries/pinata";

const formFields = [
  {
    id: "street-address",
    label: "Street Address",
    placeholder: "Street address",
    propName: "streetAddress",
    isRequired: true,
  },
  {
    id: "city",
    label: "City",
    placeholder: "City",
    propName: "city",
    isRequired: true,
  },
  {
    id: "state",
    label: "State",
    placeholder: "State",
    propName: "state",
    isRequired: true,
  },
  {
    id: "zip-code",
    label: "Zip Code",
    placeholder: "Zip code",
    propName: "zipCode",
    isRequired: true,
  },
  {
    id: "square-footage",
    label: "Square Footage",
    placeholder: "Total square footage",
    propName: "squareFootage",
    isRequired: true,
    isNumber: true,
  },
  {
    id: "bedrooms",
    label: "Bedrooms",
    placeholder: "Number of bedrooms",
    propName: "bedrooms",
    isRequired: true,
    isNumber: true,
  },
  {
    id: "bathrooms",
    label: "Bathrooms",
    placeholder: "Number of bathrooms",
    propName: "bathrooms",
    isRequired: true,
    isNumber: true,
  },
  {
    id: "parking-spots",
    label: "Parking Spots",
    placeholder: "Number of parking spots",
    propName: "parkingSpots",
    isRequired: true,
    isNumber: true,
  },
  {
    id: "additional-features",
    label: "Additional Features",
    placeholder: "Additional features",
    propName: "additionalFeatures",
    isRequired: false,
  },
];

interface Props {
  nft: Nft;
  address: `0x${string}` | undefined;
  refetch: () => void;
}

export function EditButton({ nft, address, refetch }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [pinataContent, setPinataContent] = useState<PinataContent>({
    streetAddress: nft.pinataContent.streetAddress,
    city: nft.pinataContent.city,
    state: nft.pinataContent.state,
    zipCode: nft.pinataContent.zipCode,
    squareFootage: nft.pinataContent.squareFootage,
    bedrooms: nft.pinataContent.bedrooms,
    bathrooms: nft.pinataContent.bathrooms,
    parkingSpots: nft.pinataContent.parkingSpots,
    addititonalFeatures: nft.pinataContent.addititonalFeatures,
    images: nft.pinataContent.images,
  });
  const date = new Date().getTime();
  const shouldDisable =
    isConfirming || nft.listing?.acceptedBid?.bidPrice !== 0;

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Property Updated",
        description: "Property has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
      onClose();
    }

    if (isConfirming) {
      toast({
        title: "Updating Property",
        description: "Property is being updated",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Updating Property",
        description: "Please confirm on wallet",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "error") {
      toast({
        title: "Rejected",
        description: "Action rejected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isConfirmed, isConfirming, status]);

  if (nft.owner !== address) {
    return <></>;
  }

  return (
    <>
      <Button
        size="sm"
        colorScheme="blue"
        ref={btnRef}
        onClick={onOpen}
        isDisabled={shouldDisable}
      >
        <EditIcon boxSize={5} />
      </Button>
      <Drawer
        size="xl"
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Property</DrawerHeader>

          <DrawerBody>
            <form
              id="update-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  JSON.stringify(pinataContent) ===
                  JSON.stringify(nft.pinataContent)
                ) {
                  onClose();
                  return;
                }

                const pinataMetadata = {
                  name: "ETHStates Property " + date.toString(),
                  keyvalues: {
                    ownerAddress: address,
                  },
                };

                pinataJson
                  .post("/pinning/pinJSONToIPFS", {
                    pinataContent,
                    pinataMetadata,
                  })
                  .then(({ data }) => {
                    console.log(data.IpfsHash);
                    writeContract({
                      address:
                        contractAddress.ListingContractProxy as `0x${string}`,
                      abi: marketplaceArtifact.abi,
                      functionName: "updateProperty",
                      args: [BigInt(nft.property.propertyId), data.IpfsHash],
                    });
                  });
              }}
            >
              {formFields.map((field, i) => (
                <FormControl
                  id={field.id}
                  key={i}
                  isRequired={field.isRequired}
                  mt={1}
                >
                  <FormLabel>{field.label}</FormLabel>
                  <Input
                    placeholder={field.placeholder}
                    defaultValue={pinataContent[field.propName] || ""}
                    onChange={(e) =>
                      setPinataContent({
                        ...pinataContent,
                        [field.propName]: field.isNumber
                          ? parseInt(e.target.value)
                          : e.target.value,
                      })
                    }
                  />
                </FormControl>
              ))}
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="update-form"
              isDisabled={isConfirming}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
