import { useMutation } from "wagmi";
import { pinataJson, pinataGateway } from "../../queries/pinata";
import {
  addProperty,
  getAllPropertiesByOwner,
  getAllPropertiesForSale,
  initializeDapp,
} from "../../queries/dapp";
import { useQuery } from "@tanstack/react-query";
import {
  AddPropertyProps,
  Result,
  ResultIndex,
  SaleProps,
} from "../../types/dapp";

export function useAddProperty() {
  return useMutation({
    mutationKey: ["dapp", "addProperty"],
    mutationFn: ({
      address,
      pinataContent,
      pinataMetadata,
    }: AddPropertyProps) => {
      try {
        const promise = pinataJson.post("/pinning/pinJSONToIPFS", {
          pinataContent,
          pinataMetadata,
        });
        return promise.then(({ data }) =>
          addProperty(address, data.IpfsHash, pinataContent.price)
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
}

export function useGetAllPropertiesByOwner(address: `0x${string}` | undefined) {
  return useQuery({
    queryKey: ["dapp", "getAllPropertiesByOwner", address],
    queryFn: async () => {
      const results: Result[] = await getAllPropertiesByOwner(address);
      return Promise.all(
        results.map(async (result) => {
          const response = await pinataGateway.get(
            `/ipfs/${result[ResultIndex.URI]}`
          );
          return {
            propertyId: result[ResultIndex.PROPERTY_ID],
            ...response.data,
          };
        })
      );
    },
    retry: 2,
    refetchInterval: 10000,
  });
}

export function useGetAllPropertiesForSale(address: `0x${string}` | undefined) {
  return useQuery({
    queryKey: ["dapp", "getAllPropertiesForSale", address],
    queryFn: async () => {
      const results: Result[] = await getAllPropertiesForSale(address);
      return Promise.all(
        results.map(async (result) => {
          const response = await pinataGateway.get(
            `/ipfs/${result[ResultIndex.URI]}`
          );
          return {
            propertyId: result[ResultIndex.PROPERTY_ID],
            ...response.data,
          };
        })
      );
    },
    retry: 2,
    refetchInterval: 10000,
  });
}

export function useParticularProperty(
  address: `0x${string}` | undefined,
  id: number | undefined
) {
  return useQuery({
    queryKey: ["dapp", "particularProperty", address, id?.toString()],
    queryFn: async () => {
      const dapp = await initializeDapp(address);
      return dapp.properties(id as number);
    },
    refetchInterval: 10000,
  });
}

export function useListForSale() {
  return useMutation({
    mutationKey: ["dapp", "listForSale"],
    mutationFn: async ({ address, id }: SaleProps) => {
      const dapp = await initializeDapp(address);
      return dapp.listPropertyForSale(id as number);
    },
  });
}

export function useCancelForSale() {
  return useMutation({
    mutationKey: ["dapp", "cancelForSale"],
    mutationFn: async ({ address, id }: SaleProps) => {
      const dapp = await initializeDapp(address);
      return dapp.cancelPropertySale(id as number);
    },
  });
}