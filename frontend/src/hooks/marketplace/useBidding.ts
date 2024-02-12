import { useMutation } from "@tanstack/react-query";
import { getMarketplaceContract } from "../../queries/dapp";
import { BidProps } from "../../types/listing";

export function useBid() {
  return useMutation({
    mutationKey: ["dapp", "bid"],
    mutationFn: async ({ address, id, bidPrice }: BidProps) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.bid(id as number, bidPrice);
    },
  });
}

export function useAcceptOffer() {
  return useMutation({
    mutationKey: ["dapp", "acceptOffer"],
    mutationFn: async ({ address, id, bidder }: BidProps) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.acceptOffer(id as number, bidder);
    },
  });
}
