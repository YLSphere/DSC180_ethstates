export interface LoanResult {
  0: `0x${string}`; // lender
  1: bigint; // annualInterestRate
  2: bigint; // maxDurationInMonths
}

export enum LoanResultIndex {
  LENDER,
  ANNUAL_INTEREST_RATE,
  MAX_DURATION_IN_MONTHS
}

export interface Loan {
  lender: `0x${string}`;
  annualInterestRate: number;
  maxDurationInMonths: number;
}

enum FinancingStatus {
  None,
  Pending,
  Rejected,
  Active,
  Default,
  PaidOff
}

export interface FinancingResult {
  0: bigint; // propertyId
  1: string; // loaner
  2: bigint; // loanId
  3: FinancingStatus; // status
  4: bigint; // loanAmount
  5: bigint; // durationInMonths
  6: bigint; // paidMonths
}

export enum FinancingResultIndex {
  PROPERTY_ID,
  LOANER,
  LOAN_ID,
  STATUS,
  LOAN_AMOUNT,
  DURATION_IN_MONTHS,
  PAID_MONTHS
}

export interface Financing {
  propertyId: number;
  loaner: string;
  loanId: number;
  status: FinancingStatus;
  loanAmount: number;
  durationInMonths: number;
  paidMonths: number;
}

export interface FinancingProps {
  address: `0x${string}`;
  financingId: number;
  propertyId: number;
  loaner?: string;
  loanId: number;
  status?: FinancingStatus;
  loanAmount: number;
  durationInMonths: number;
  paidMonths?: number;
}