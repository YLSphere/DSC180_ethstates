import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getMarketplaceContract,
  getFinancingContract,
} from "../../queries/dapp";
import {
  Financing,
  FinancingProps,
  FinancingResult,
  FinancingResultIndex,
} from "../../types/financing";

export function useRequestFinancing() {
  return useMutation({
    mutationKey: ["dapp", "requestFinancing"],
    mutationFn: async ({
      address,
      loanId,
      propertyId,
      loanAmount,
      durationInMonths,
    }: FinancingProps) => {
      const dapp = await getMarketplaceContract(address);
      return dapp.requestFinancing(
        loanId,
        propertyId,
        loanAmount,
        durationInMonths
      );
    },
  });
}

export function useAcceptFinancing() {
  return useMutation({
    mutationKey: ["dapp", "acceptFinancing"],
    mutationFn: async ({ address, financingId }: FinancingProps) => {
      const financing = await getFinancingContract(address);
      const loanAmount = (await financing.financings(financingId)).loanAmount;
      return financing.acceptFinancing(financingId, { value: loanAmount });
    },
  });
}

export function useRejectFinancing() {
  return useMutation({
    mutationKey: ["dapp", "rejectFinancing"],
    mutationFn: async ({ address, financingId }: FinancingProps) => {
      const financing = await getFinancingContract(address);
      return financing.rejectFinancing(financingId);
    },
  });
}

export function useGetFinancingByPropertyId(
  address: `0x${string}` | undefined,
  propertyId: number
) {
  return useQuery({
    queryKey: ["dapp", "getFinancingByPropertyId", address, propertyId],
    queryFn: async (): Promise<Financing> => {
      const financing = await getFinancingContract(address);
      const currentFinancing: FinancingResult = await financing.getFinancing(
        propertyId
      );
      return {
        loanId: Number(currentFinancing[FinancingResultIndex.LOAN_ID]),
        propertyId: Number(currentFinancing[FinancingResultIndex.PROPERTY_ID]),
        loanAmount: Number(currentFinancing[FinancingResultIndex.LOAN_AMOUNT]),
        durationInMonths: Number(
          currentFinancing[FinancingResultIndex.DURATION_IN_MONTHS]
        ),
        paidMonths: Number(currentFinancing[FinancingResultIndex.PAID_MONTHS]),
        loaner: currentFinancing[FinancingResultIndex.LOANER],
        status: currentFinancing[FinancingResultIndex.STATUS],
      };
    },
  });
}

export function useGetFinancingByFinancingId(
  address: `0x${string}` | undefined,
  financingId: number
) {
  return useQuery({
    queryKey: ["dapp", "getFinancingByFinancingId", address, financingId],
    queryFn: async (): Promise<Financing> => {
      const financing = await getFinancingContract(address);
      const currentFinancing: FinancingResult = await financing.financings(
        financingId
      );
      return {
        loanId: Number(currentFinancing[FinancingResultIndex.LOAN_ID]),
        propertyId: Number(currentFinancing[FinancingResultIndex.PROPERTY_ID]),
        loanAmount: Number(currentFinancing[FinancingResultIndex.LOAN_AMOUNT]),
        durationInMonths: Number(
          currentFinancing[FinancingResultIndex.DURATION_IN_MONTHS]
        ),
        paidMonths: Number(currentFinancing[FinancingResultIndex.PAID_MONTHS]),
        loaner: currentFinancing[FinancingResultIndex.LOANER],
        status: currentFinancing[FinancingResultIndex.STATUS],
      };
    },
  });
}
