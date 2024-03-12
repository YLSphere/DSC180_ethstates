import React from "react";
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
  import Dropzone from "../components/form/Dropzone";
  
  import { pinataImage } from "../queries/pinata";
  import { useAddLoaner } from "../hooks/financing/useFinancing";
  
  import { LoanerPinataContent } from "../types/financing";
  import { useNavigate } from "react-router-dom";
  
  const formFields = [
    {
      id: "loanerName",
      label: "Display name",
      placeholder: "Eg. ETHState loaner",
      propName: "loanerName",
      isRequired: true,
    },
    {
      id: "apr",
      label: "Desired APR (%)",
      placeholder: "Eg. 8",
      propName: "apr",
      isRequired: true,
      isNumber: true,
    },
    {
      id: "maxMonths",
      label: "Max Months for a contract",
      placeholder: "Eg. 12",
      propName: "maxMonths",
      isRequired: true,
      isNumber: true,
    },
    {
      id: "additional-information",
      label: "Additional Information",
      placeholder: "Additional Information",
      propName: "additionalInformation",
      isRequired: false,
    },
  ];
  
  export default function ListLoaner() {
    const toast = useToast();
    const navigate = useNavigate();
    const addLoaner = useAddLoaner();
    const { address, isConnected } = useAccount();
    const [loanerPinataContent, setLoanerPinataContent] = useState<LoanerPinataContent>({
      loanerName: "",
      annualInterestRate: 0,
      maxMonths: 0,
      additionalInformation: "",
      images: [],
    });

    const date = new Date().getTime();
  
    useEffect(() => {
      // When the mutation is loading, show a toast
      if (addLoaner.isPending) {
        toast({
          status: "loading",
          title: "Listing you as an investor",
          description: "Please confirm on Metamask",
        });
      }
  
      // When the mutation fails, show a toast
      if (addLoaner.isError) {
        toast({
          status: "error",
          title: "Listing failed",
          description: "Something wrong",
          duration: 5000,
        });
      }
  
      // When the mutation is successful, show a toast
      if (addLoaner.isSuccess) {
        toast({
          status: "success",
          title: "You are now an ETHStates investor",
          description: "Looks great, redirecting you...",
          duration: 10000,
        });
        setTimeout(() => {
          navigate("/profile");
        }, 10000);
      }
    }, [addLoaner]);
  
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      // Prevent the default form submission behavior
      e.preventDefault();
  
      if (isConnected) {
        const loanerPinataMetadata = {
          name: "ETHStates loaner" + date.toString(),
          keyvalues: {
            ownerAddress: address,
          },
        };
  
        addLoaner.mutate({ address, loanerPinataContent, loanerPinataMetadata});
      }
    }
  
    async function handleUpload(
      files: File[],
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) {
      setIsLoading(true);
  
      const loanerPinataMetadata = {
        name: "EthStates Loaner Image",
        keyvalues: {
          ownerAddress: address,
        },
      };
      const cids = await Promise.all(
        files.map(async (file) => {
          const response = await pinataImage.post("/pinning/pinFileToIPFS", {
            file,
            loanerPinataMetadata
          });
          return response.data.IpfsHash;
        })
      );
  
      setLoanerPinataContent({
        ...loanerPinataContent,
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
                    setLoanerPinataContent({
                      ...loanerPinataContent,
                      [field.propName]: field.isNumber
                        ? field.propName === "price"
                          ? parseFloat(e.target.value)
                          : parseInt(e.target.value)
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
  