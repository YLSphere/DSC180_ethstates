import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import contractAddress from "../contracts/contract-address.json";
import marketplaceArtifact from "../contracts/ListingContract.json";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import Dropzone from "../components/form/Dropzone";

import { pinataImage, pinataJson } from "../queries/pinata";

import { PinataContent } from "../types/property";
import { useNavigate } from "react-router-dom";
import "../../../fonts/IBMPlexSansCondensed-Regular.ttf";
import "../../../fonts/IBMPlexSans-Regular.ttf";
import "../../../fonts/JosefinSans-Regular.ttf";
import "../App.css";
import { CHAIN_ID } from "../types/constant";
import { ethers } from "ethers";

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

export default function ListProperty() {
  const toast = useToast();
  const navigate = useNavigate();
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { address, chainId, isConnected } = useAccount();
  const [pinataContent, setPinataContent] = useState<PinataContent>({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    squareFootage: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpots: 0,
    addititonalFeatures: "",
    images: [],
  });
  const [price, setPrice] = useState<number>(0);
  const date = new Date().getTime();

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (status === "pending") {
      toast({
        status: "info",
        title: "Confirm transaction",
        description: "Please confirm on wallet",
        duration: 5000,
      });
    }

    // When the mutation fails, show a toast
    if (status === "error") {
      toast({
        status: "error",
        title: "Rejected",
        description: "Action rejected",
        duration: 5000,
      });
    }

    if (isConfirming) {
      toast({
        status: "info",
        title: "Minting Property",
        description: "Property is being minted",
        duration: 5000,
      });
    }

    if (isConfirmed) {
      toast({
        status: "success",
        title: "Property Minted",
        description: "Property has been minted. Redirecting ...",
        duration: 5000,
      });
      setTimeout(() => {
        navigate("/profile");
      }, 5000);
    }
  }, [isConfirming, isConfirmed, status]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior
    e.preventDefault();

    if (isConnected && address) {
      const pinataMetadata = {
        name: "ETHStates Property " + date.toString(),
        keyvalues: {
          ownerAddress: address,
        },
      };

      // addProperty.mutate({ address, pinataContent, pinataMetadata, price });
      pinataJson
        .post("/pinning/pinJSONToIPFS", {
          pinataContent,
          pinataMetadata,
        })
        .then(({ data }) =>
          writeContract({
            address: contractAddress.ListingContractProxy as `0x${string}`,
            abi: marketplaceArtifact.abi,
            functionName: "addProperty",
            args: [data.IpfsHash, ethers.parseEther(price.toString())],
          })
        );
    }
  }

  async function handleUpload(
    files: File[],
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setIsLoading(true);

    const pinataMetadata = {
      name: "EthStates Property Image",
      keyvalues: {
        ownerAddress: address,
      },
    };
    const cids = await Promise.all(
      files.map(async (file) => {
        const response = await pinataImage.post("/pinning/pinFileToIPFS", {
          file,
          pinataMetadata,
        });
        return response.data.IpfsHash;
      })
    );

    setPinataContent({
      ...pinataContent,
      images: cids,
    });
    setIsLoading(false);
  }

  // Wallet not connected
  if (!isConnected) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
          maxWidth="container.lg"
        >
          <Text fontSize={"3xl"} color={"gray.500"}>
            Connect to your wallet first!
          </Text>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container maxWidth={"container.md"} fontFamily="Josefin Sans">
        <form onSubmit={handleSubmit}>
          {formFields.map((field, i) => (
            <FormControl
              id={field.id}
              key={i}
              isRequired={field.isRequired}
              mt={3}
            >
              <FormLabel>{field.label}</FormLabel>
              <Input
                placeholder={field.placeholder}
                borderWidth={'2px'}
                borderColor={'gray.700'}
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

          <FormControl id="price" isRequired mt={3}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              step="0.01"
              placeholder="Price of the property"
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </FormControl>

          <Dropzone onUpload={handleUpload} />

          <Button my={4} colorScheme="teal" type="submit" alignItems={'center'} justifyContent={'center'} position = 'relative'>
            Submit
          </Button>
        </form>
      </Container>
    </main>
  );
}
