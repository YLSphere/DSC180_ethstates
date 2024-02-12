import { useMutation } from "wagmi";
import { pinataJson, pinataGateway } from "../../queries/pinata";
import { getMarketplaceContract } from "../../queries/dapp";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  ListingResult,
  ListingResultIndex,
  Nft,
} from "../../types/listing";
import {
  AddPropertyProps,
  PropertyResult,
  PropertyResultIndex,
} from "../../types/property";

export function useAddProperty() {
  return useMutation({
    mutationKey: ["dapp", "addProperty"],
    mutationFn: async ({
      address,
      pinataContent,
      pinataMetadata,
    }: AddPropertyProps) => {
      try {
        const dapp = await getMarketplaceContract(address);
        const promise = pinataJson.post("/pinning/pinJSONToIPFS", {
          pinataContent,
          pinataMetadata,
        });
        return promise.then(({ data }) => dapp.addProperty(data.IpfsHash, pinataContent.price));
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
    queryFn: async (): Promise<Nft[]> => {
      const dapp = await getMarketplaceContract(address);
      const results: PropertyResult[] = await dapp.getPropertiesByOwner(
        address
      );
      return Promise.all(
        results.map(async (result) => {
          const response = await pinataGateway.get(
            `/ipfs/${result[PropertyResultIndex.URI]}`
          );
          const ownerAddress: `0x${string}` | undefined = await dapp.ownerOf(
            result[PropertyResultIndex.PROPERTY_ID]
          );
          return {
            propertyId: result[PropertyResultIndex.PROPERTY_ID],
            

            ...response.data,
            owner: ownerAddress,
            // CHANGE UP ON PINATA CONTENT
            price: result[PropertyResultIndex.PRICE],
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
        const dapp = await getMarketplaceContract(address);
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
    queryFn: async (): Promise<Nft> => {
      try {
        const dapp = await getMarketplaceContract(address);
        const propertyResult: PropertyResult = await dapp.properties(
          id as number
        );
        const listingResult: ListingResult = await dapp.getListing(
          id as number
        );
        const ownerAddress: `0x${string}` | undefined = await dapp.ownerOf(
          id as number
        );
        const response = await pinataGateway.get(
          `/ipfs/${propertyResult[PropertyResultIndex.URI]}`
        );
        return {
          // property data
          propertyId: propertyResult[PropertyResultIndex.PROPERTY_ID],
          uri: propertyResult[PropertyResultIndex.URI],
          
          // listing data
          sellPrice: listingResult[ListingResultIndex.SELL_PRICE],
          buyerApproved: listingResult[ListingResultIndex.BUYER_APPROVED],
          sellerApproved: listingResult[ListingResultIndex.SELLER_APPROVED],
          bids: listingResult[ListingResultIndex.BIDS],
          acceptedBid: listingResult[ListingResultIndex.ACCEPTED_BID],
          // pinata data
          ...response.data,
          owner: ownerAddress,
          forSale: listingResult[ListingResultIndex.PROPERTY_ID] > 0,
          // CHANGE UP ON PINATA CONTENT
          price: propertyResult[PropertyResultIndex.PRICE],
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
