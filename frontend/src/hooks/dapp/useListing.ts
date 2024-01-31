import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ListingProps,
  ListingResult,
  ListingResultIndex,
  Nft,
  PropertyResult,
  PropertyResultIndex,
} from "../../types/dapp";
import { initializeDapp } from "../../queries/dapp";
import { pinataGateway } from "../../queries/pinata";

export function useGetAllListings(address: `0x${string}` | undefined) {
  return useQuery({
    queryKey: ["dapp", "getAllPropertiesForSale", address],
    queryFn: async (): Promise<Nft[]> => {
      try {
        const dapp = await initializeDapp(address);
        const listingResults: ListingResult[] = await dapp.getActiveListings();
        return Promise.all(
          listingResults.map(async (result) => {
            const propertyResult: PropertyResult = await dapp.properties(
              result[ListingResultIndex.PROPERTY_ID]
            );
            const response = await pinataGateway.get(
              `/ipfs/${propertyResult[PropertyResultIndex.URI]}`
            );
            return {
              // property data
              propertyId: result[PropertyResultIndex.PROPERTY_ID],
              // listing data
              sellPrice: result[ListingResultIndex.SELL_PRICE],
              buyerApproved: result[ListingResultIndex.BUYER_APPROVED],
              sellerApproved: result[ListingResultIndex.SELLER_APPROVED],
              bids: result[ListingResultIndex.BIDS],
              acceptedBid: result[ListingResultIndex.ACCEPTED_BID],
              // pinata data
              ...response.data,
              forSale: result[ListingResultIndex.SELL_PRICE] > 0,
            };
          })
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    retry: 2,
    refetchInterval: 10000,
  });
}

export function useList() {
  return useMutation({
    mutationKey: ["dapp", "list"],
    mutationFn: async ({ address, id, sellPrice }: ListingProps) => {
      const dapp = await initializeDapp(address);
      return dapp.listProperty(id as number, sellPrice);
    },
  });
}

export function useUnlist() {
  return useMutation({
    mutationKey: ["dapp", "unlist"],
    mutationFn: async ({ address, id }: ListingProps) => {
      const dapp = await initializeDapp(address);
      return dapp.unlistProperty(id as number);
    },
  });
}
