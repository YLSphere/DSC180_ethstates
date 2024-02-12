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

// export function useRemoveBid() {
//   return useMutation({
//     mutationKey: ["dapp", "removeBid"],
//     mutationFn: async ({ address, id, bidder }: BidProps) => {
//       const dapp = await getMarketplaceContract(address);
//       try{
//       return dapp.removeBid(id as number, bidder);
//       } catch (error){
//         console.error('Error removing bid:', error);
//       }
//     },
//   });
// }

// export function useEndBiddingProcess() {
//   return useMutation({
//     mutationKey: ["dapp", "endBiddingProcess"],
//     mutationFn: async ({ address, id}: BidProps) => {
//       const dapp = await initializeDapp(address);
//       return dapp.endBiddingProcess(id as number);
//     },
//   });
// }

export function useApproveTransferAsBuyer() {
  return useMutation({
    mutationKey: ["dapp", "approveTransferAsBuyer"],
    mutationFn: async ({ address, id, bidPrice }: BidProps) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.approveTransferAsBuyer(id as number, { value: bidPrice });
    },
  });
}
