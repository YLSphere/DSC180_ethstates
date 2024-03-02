import { Financing } from "./financing";
import { PinataContent, Property } from "./property";

export interface BidResult {
  0: `0x${string}`; // bidder
  1: bigint; // bidPrice
}

export enum BidResultIndex {
  BIDDER,
  BID_PRICE,
}

export interface Bid {
  bidder: `0x${string}`;
  bidPrice: number;
}

export interface AcceptedBidResult {
  0: `0x${string}`; // bidder
  1: bigint; // bidPrice
  2: bigint; // financingId
}

export enum AcceptedBidResultIndex {
  BIDDER,
  BID_PRICE,
  FINANCING_ID,
}

export interface AcceptedBid {
  bidder: `0x${string}`;
  bidPrice: number;
  financingId: number;
}

export interface ListingResult {
  0: bigint; // propertyId
  1: bigint; // sellPrice
  2: boolean; // buyerApproved
  3: boolean; // sellerApproved
  4: bigint; // financingId
  5: BidResult[]; // bids
  6: AcceptedBidResult; // acceptedBid
}

export enum ListingResultIndex {
  PROPERTY_ID,
  SELL_PRICE,
  BUYER_APPROVED,
  SELLER_APPROVED,
  FINANCING_ID,
  BIDS,
  ACCEPTED_BID,
}

export interface Listing {
  propertyId: number;
  sellPrice: number;
  buyerApproved: boolean;
  sellerApproved: boolean;
  financingId: number;
  bids?: Bid[];
  acceptedBid?: AcceptedBid;
}

export interface Nft {
  owner: `0x${string}`;

  // Property data
  property: Property;

  // Listing data
  listing?: Listing;

  // Financing data
  financing?: Financing;

  // Pinata data
  pinataContent: PinataContent;
}

export interface ListingProps {
  address: `0x${string}`;
  id: number | undefined;
}

export interface BidProps {
  address: `0x${string}`;
  id: number | undefined;
  bidder?: `0x${string}`;
  bidPrice?: number;
}
