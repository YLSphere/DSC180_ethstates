import { useMutation } from "wagmi";
import { pinataJson, pinataGateway } from "../../queries/pinata";
import { getFinancingContract, getMarketplaceContract } from "../../queries/dapp";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  ListingResult,
  ListingResultIndex,
  Listing,
  Nft,
  Bid,
  BidResultIndex,
  AcceptedBidResultIndex,
} from "../../types/listing";
import {
  AddPropertyProps,
  Property,
  PropertyResult,
  PropertyResultIndex,
} from "../../types/property";
import { Financing, FinancingResult, FinancingResultIndex } from "../../types/financing";

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
        const price = pinataContent.price;
        delete pinataContent.price;
        const promise = pinataJson.post("/pinning/pinJSONToIPFS", {
          pinataContent,
          pinataMetadata,
        });
        return promise.then(({ data }) =>
          dapp.addProperty(data.IpfsHash, price)
        );
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
      try {
        const dapp = await getMarketplaceContract(address);
        const results: PropertyResult[] = await dapp.getPropertiesByOwner(
          address
        );
        return Promise.all(
          results.map(async (result) => {
            const owner = await dapp.ownerOf(
              result[PropertyResultIndex.PROPERTY_ID]
            );
            const property: Property = {
              propertyId: Number(result[PropertyResultIndex.PROPERTY_ID]),
              price: Number(result[PropertyResultIndex.PRICE]),
              uri: result[PropertyResultIndex.URI],
            };
            const response = await pinataGateway.get(
              `/ipfs/${result[PropertyResultIndex.URI]}`
            );
            return {
              owner,
              // property data
              property,
              // pinata data
              pinataContent: response.data,
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
        // Get the property data
        const owner = await dapp.ownerOf(id as number);
        const propertyResult: PropertyResult = await dapp.getPropertyById(
          id as number
        );
        const property: Property = {
          propertyId: Number(propertyResult[PropertyResultIndex.PROPERTY_ID]),
          price: Number(propertyResult[PropertyResultIndex.PRICE]),
          uri: propertyResult[PropertyResultIndex.URI],
        };
        // Get the listing data
        const listingResult: ListingResult = await dapp.getListing(
          id as number
        );
        const listing: Listing = {
          propertyId: Number(listingResult[ListingResultIndex.PROPERTY_ID]),
          sellPrice: Number(listingResult[ListingResultIndex.SELL_PRICE]),
          buyerApproved: listingResult[ListingResultIndex.BUYER_APPROVED],
          sellerApproved: listingResult[ListingResultIndex.SELLER_APPROVED],
          financingId: Number(listingResult[ListingResultIndex.FINANCING_ID]),
          bids: listingResult[ListingResultIndex.BIDS].map(
            (bid): Bid => ({
              bidder: bid[BidResultIndex.BIDDER],
              bidPrice: Number(bid[BidResultIndex.BID_PRICE]),
            })
          ),
          acceptedBid: {
            bidder:
              listingResult[ListingResultIndex.ACCEPTED_BID][
                AcceptedBidResultIndex.BIDDER
              ],
            bidPrice: Number(
              listingResult[ListingResultIndex.ACCEPTED_BID][
                AcceptedBidResultIndex.BID_PRICE
              ]
            ),
            financingId: Number(
              listingResult[ListingResultIndex.ACCEPTED_BID][
                AcceptedBidResultIndex.FINANCING_ID
              ]
            ),
          },
        };
        // Get the financing data
        const financing = await getFinancingContract(address);
        const currentFinancing: FinancingResult = await financing.getFinancing(
          id
        );
        const financingData: Financing ={
          loanId: Number(currentFinancing[FinancingResultIndex.LOAN_ID]),
          propertyId: Number(
            currentFinancing[FinancingResultIndex.PROPERTY_ID]
          ),
          loanAmount: Number(
            currentFinancing[FinancingResultIndex.LOAN_AMOUNT]
          ),
          durationInMonths: Number(
            currentFinancing[FinancingResultIndex.DURATION_IN_MONTHS]
          ),
          paidMonths: Number(
            currentFinancing[FinancingResultIndex.PAID_MONTHS]
          ),
          loaner: currentFinancing[FinancingResultIndex.LOANER],
          status: currentFinancing[FinancingResultIndex.STATUS],
        };
        // Get the pinata content
        const response = await pinataGateway.get(
          `/ipfs/${propertyResult[PropertyResultIndex.URI]}`
        );

        return {
          owner,
          // property data
          property,
          // listing data
          listing,
          // financing data
          financing: financingData,
          // pinata data
          pinataContent: response.data,
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

export function useSetPrice() {
  return useMutation({
    mutationKey: ["dapp", "setPrice"],
    mutationFn: async ({
      address,
      id,
      price,
    }: {
      address: `0x{string}`;
      id: number;
      price: number;
    }) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.setPrice(id, price);
    },
  });
}
