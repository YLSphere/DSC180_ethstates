import { useMutation } from "wagmi";
import { pinataJson, pinataGateway } from "../../queries/pinata";
import { initializeDapp } from "../../queries/dapp";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  AddPropertyProps,
  ListingResult,
  ListingResultIndex,
  Nft,
  PropertyResult,
  PropertyResultIndex,
} from "../../types/dapp";

export function useAddProperty() {
  return useMutation({
    mutationKey: ["dapp", "addProperty"],
    mutationFn: async ({
      address,
      pinataContent,
      pinataMetadata,
    }: AddPropertyProps) => {
      try {
        const dapp = await initializeDapp(address);
        const promise = pinataJson.post("/pinning/pinJSONToIPFS", {
          pinataContent,
          pinataMetadata,
        });
        return promise.then(({ data }) => dapp.addProperty(data.IpfsHash));
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
}

export function useGetAllPropertiesByOwner(
  address: `0x${string}` | undefined
): UseQueryResult<Nft[], Error> {
  return useQuery({
    queryKey: ["dapp", "getAllPropertiesByOwner", address],
    queryFn: async () => {
      const dapp = await initializeDapp(address);
      const results: PropertyResult[] = await dapp.getPropertiesByOwner(
        address
      );
      return Promise.all(
        results.map(async (result) => {
          const response = await pinataGateway.get(
            `/ipfs/${result[PropertyResultIndex.URI]}`
          );
          return {
            propertyId: result[PropertyResultIndex.PROPERTY_ID],
            ...response.data,
          };
        })
      );
    },
    retry: 2,
    refetchInterval: 10000,
  });
}

export function useGetPropertyCount(
  address: `0x${string}` | undefined
): UseQueryResult<number, Error> {
  return useQuery({
    queryKey: ["dapp", "getPropertyCount", address],
    queryFn: async () => {
      try {
        const dapp = await initializeDapp(address);
        return dapp.getPropertyCount();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    retry: 2,
    refetchInterval: 10000,
  });
}

export function useParticularProperty(
  address: `0x${string}` | undefined,
  id: number | undefined
): UseQueryResult<Nft, Error> {
  return useQuery({
    queryKey: ["dapp", "particularProperty", address, id?.toString()],
    queryFn: async () => {
      try {
        const dapp = await initializeDapp(address);
        const propertyResult: PropertyResult = await dapp.properties(
          id as number
        );
        const listingResult: ListingResult = await dapp.getListing(
          id as number
        );
        const response = await pinataGateway.get(
          `/ipfs/${propertyResult[PropertyResultIndex.URI]}`
        );

        return {
          propertyId: propertyResult[PropertyResultIndex.PROPERTY_ID],
          uri: propertyResult[PropertyResultIndex.URI],

          sellPrice: listingResult[ListingResultIndex.SELL_PRICE],
          buyerApproved: listingResult[ListingResultIndex.BUYER_APPROVED],
          sellerApproved: listingResult[ListingResultIndex.SELLER_APPROVED],
          bids: listingResult[ListingResultIndex.BIDS],
          acceptedBid: listingResult[ListingResultIndex.ACCEPTED_BID],

          ...response.data,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    retry: 2,
    refetchInterval: 10000,
  });
}
