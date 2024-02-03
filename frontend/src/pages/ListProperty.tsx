
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Dropzone from "../components/templates/form/Dropzone";

import { pinataImage } from "../queries/pinata";
import { useAddProperty } from "../hooks/dapp/useProperty";
import { useNavigate } from 'react-router-dom';
import { PinataContent } from "../types/dapp";

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
  {
    id: "price",
    label: "Price",
    placeholder: "Price of the property",
    propName: "price",
    isRequired: true,
    isNumber: true,
  },
];

export default function ListProperty() {
  const toast = useToast();
  const navigate = useNavigate();
  const addProperty = useAddProperty();
  const { address, isConnected } = useAccount();
  const [pinataContent, setPinataContent] = useState<PinataContent>({
    owner: address,
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    squareFootage: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpots: 0,
    addititonalFeatures: "",
    price: 0,
    images: [],
  });
  const date = new Date().getTime();

  useEffect(() => {
    // When the mutation is loading, show a toast
    if (addProperty.isLoading) {
      toast({
        status: "loading",
        title: "Property NFT pending",
        description: "Please confirm on Metamask",
      });
    }

    // When the mutation fails, show a toast
    if (addProperty.isError) {
      toast({
        status: "error",
        title: "Property NFT rejected",
        description: "Something wrong",
        duration: 5000,
      });
    }

    // When the mutation is successful, show a toast
    if (addProperty.isSuccess) {
      toast({
        status: "success",
        title: "Property NFT minted",
        description: "Looks great, redirecting you...",
        duration: 10000,
      });
      setTimeout(() => {
        navigate('/profile')
      }, 10000)
    }
  }, [addProperty]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior
    e.preventDefault();

    if (isConnected) {
      const pinataMetadata = {
        name: "ETHStates Property " + date.toString(),
        keyvalues: {
          ownerAddress: address,
        },
      };

      addProperty.mutate({ address, pinataContent, pinataMetadata });
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
      <Container maxWidth={"container.md"}>
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
          <Dropzone onUpload={handleUpload} />

          <Button my={4} colorScheme="teal" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    </main>
  );
}
