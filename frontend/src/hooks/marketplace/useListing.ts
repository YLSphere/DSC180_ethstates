import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AcceptedBidResultIndex,
  Bid,
  BidResultIndex,
  Listing,
  ListingProps,
  ListingResult,
  ListingResultIndex,
  Nft,
} from "../../types/listing";
import {
  Property,
  PropertyResult,
  PropertyResultIndex,
} from "../../types/property";
import { getMarketplaceContract } from "../../queries/dapp";
import { pinataGateway } from "../../queries/pinata";
import { ethers } from "ethers";

export function useGetAllListings(address: `0x${string}` | undefined) {
  return useQuery({
    queryKey: ["dapp", "getAllPropertiesForSale", address],
    queryFn: async (): Promise<Nft[]> => {
      try {
        const dapp = await getMarketplaceContract(address);
        const listingResults: ListingResult[] = await dapp.getActiveListings();
        return Promise.all(
          listingResults.map(async (result) => {
            const owner = await dapp.ownerOf(
              result[ListingResultIndex.PROPERTY_ID]
            );
            // Get the property data
            const propertyResult: PropertyResult = await dapp.getPropertyById(
              result[ListingResultIndex.PROPERTY_ID]
            );
            const property: Property = {
              propertyId: Number(
                propertyResult[PropertyResultIndex.PROPERTY_ID]
              ),
              price: parseFloat(
                ethers.formatEther(propertyResult[PropertyResultIndex.PRICE])
              ),
              uri: propertyResult[PropertyResultIndex.URI],
            };
            // Get the listing data
            const listing: Listing = {
              propertyId: Number(result[ListingResultIndex.PROPERTY_ID]),
              sellPrice: parseFloat(
                ethers.formatEther(result[ListingResultIndex.SELL_PRICE])
              ),
              buyerApproved: result[ListingResultIndex.BUYER_APPROVED],
              sellerApproved: result[ListingResultIndex.SELLER_APPROVED],
              financingId: Number(result[ListingResultIndex.FINANCING_ID]),
              bids: result[ListingResultIndex.BIDS].map(
                (bid): Bid => ({
                  bidder: bid[BidResultIndex.BIDDER],
                  bidPrice: parseFloat(
                    ethers.formatEther(bid[BidResultIndex.BID_PRICE])
                  ),
                })
              ),
              acceptedBid: {
                bidder:
                  result[ListingResultIndex.ACCEPTED_BID][
                    AcceptedBidResultIndex.BIDDER
                  ],
                bidPrice: parseFloat(
                  ethers.formatEther(
                    result[ListingResultIndex.ACCEPTED_BID][
                      AcceptedBidResultIndex.BID_PRICE
                    ]
                  )
                ),
                financingId: Number(
                  result[ListingResultIndex.ACCEPTED_BID][
                    AcceptedBidResultIndex.FINANCING_ID
                  ]
                ),
              },
            };
            // Get the pinata data
            const response = await pinataGateway.get(
              `/ipfs/${propertyResult[PropertyResultIndex.URI]}`
            );
            return {
              owner,
              // property data
              property,
              // listing data
              listing,
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

export function useList() {
  return useMutation({
    mutationKey: ["dapp", "list"],
    mutationFn: async ({ address, id }: ListingProps) => {
      try {
        const dapp = await getMarketplaceContract(address);
        return dapp.listProperty(id as number);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
}

export function useUnlist() {
  return useMutation({
    mutationKey: ["dapp", "unlist"],
    mutationFn: async ({ address, id }: ListingProps) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.unlistProperty(id as number);
    },
  });
}
