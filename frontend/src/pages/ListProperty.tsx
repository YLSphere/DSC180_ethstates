import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";

import pinata from "../services/Pinata";
interface PinataContent {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  addititonalFeatures: string;
  price: number;
  forSale: boolean;
  image: string;
  propID: number;
}

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

let d1 = new Date().getTime()
export default function ListProperty() {
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
    price: 0,
    forSale: false,
    image: "",
    propID: d1,
  });
  const { address, isConnected } = useAccount();
  


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior
    e.preventDefault();

    if (isConnected) {
      const pinataMetadata = {
        name: "ETHStates Property " + d1.toString(),
        keyvalues: {
          ownerAddress: address,
        },
      };

      pinata
        .post("/pinning/pinJSONToIPFS", {
          pinataContent,
          pinataMetadata,
        })
        .then(function (response) {
          console.log("image uploaded", response.data.IpfsHash)
          return {
             success: true,
             // Returns  IPFS Hash Link
             pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
         };
      })
        .catch(console.log);
    }

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

          <Button mt={4} colorScheme="teal" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    </main>
  );
}
