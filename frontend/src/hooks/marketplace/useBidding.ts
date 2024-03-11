import { useMutation } from "@tanstack/react-query";
import { getMarketplaceContract } from "../../queries/dapp";
import { BidProps } from "../../types/listing";
import { ethers } from "ethers";

export function useBid() {
  return useMutation({
    mutationKey: ["dapp", "bid"],
    mutationFn: async ({
      address,
      id,
      bidPrice,
    }: {
      address: `0x${string}`;
      id: number;
      bidPrice: number;
    }) => {
      const dapp = await getMarketplaceContract(address);
      const parsedBidPrice = ethers.parseEther(bidPrice.toString());
      return dapp.bid(BigInt(id), parsedBidPrice);
    },
  });
}

export function useUnbid() {
  return useMutation({
    mutationKey: ["dapp", "unbid"],
    mutationFn: async ({ address, id }: {
      address: `0x${string}`;
      id: number;
    }) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.unbid(BigInt(id));
    },
  });
}

export function useAcceptOffer() {
  return useMutation({
    mutationKey: ["dapp", "acceptOffer"],
    mutationFn: async ({ address, id, bidder }: BidProps) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.acceptOffer(BigInt(id!), bidder);
    },
  });
}

export function useRemoveBid() {
  return useMutation({
    mutationKey: ["dapp", "removeBid"],
    mutationFn: async ({ address, id, bidder }: BidProps) => {
      const dapp = await getMarketplaceContract(address);
      try{
      return dapp.removeBid(id as number, bidder);
      } catch (error){
        console.error('Error removing bid:', error);
      }
    },
  });
}

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
    mutationFn: async ({
      address,
      id,
      bidPrice,
    }: {
      address: `0x${string}`;
      id: number;
      bidPrice: number;
    }) => {
      const dapp = await getMarketplaceContract(address);
      const parsedBidPrice = ethers.parseEther(bidPrice.toString());
      return dapp.approveTransferAsBuyer(BigInt(id!), {
        value: parsedBidPrice,
      });
    },
  });
}
