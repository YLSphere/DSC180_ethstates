import { useMutation } from "@tanstack/react-query";
import { initializeDapp } from "../../queries/dapp";
import { BidProps } from "../../types/dapp";

export function useBid() {
  return useMutation({
    mutationKey: ["dapp", "bid"],
    mutationFn: async ({ address, id, bidPrice }: BidProps) => {
      const dapp = await initializeDapp(address);
      return dapp.bid(id as number, bidPrice);
    },
  });
}

export function useAcceptOffer() {
  return useMutation({
    mutationKey: ["dapp", "acceptOffer"],
    mutationFn: async ({ address, id, bidder }: BidProps) => {
      const dapp = await initializeDapp(address);
      return dapp.acceptOffer(id as number, bidder);
    },
  });
}

export function useRemoveBid() {
  return useMutation({
    mutationKey: ["dapp", "removeBid"],
    mutationFn: async ({ address, id, bidder }: BidProps) => {
      const dapp = await initializeDapp(address);
      try{
      return dapp.removeBid(id as number, bidder);
      } catch (error){
        console.error('Error removing bid:', error);
      }
    },
  });
}
