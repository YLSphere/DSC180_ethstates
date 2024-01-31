export interface PropertyResult {
  0: number; // propertyId
  1: string; // uri
}

export enum PropertyResultIndex {
  PROPERTY_ID,
  URI,
}

export interface ListingResult {
  0: number; // propertyId
  1: number; // sellPrice
  2: boolean; // buyerApproved
  3: boolean; // sellerApproved
  4: BidResult[]; // bids
  5: BidResult; // acceptedBid
}

export enum ListingResultIndex {
  PROPERTY_ID,
  SELL_PRICE,
  BUYER_APPROVED,
  SELLER_APPROVED,
  BIDS,
  ACCEPTED_BID,
}

export interface BidResult {
  0: `0x${string}`; // bidder
  1: number; // bidPrice
}

export enum BidResultIndex {
  BIDDER,
  BID_PRICE,
}

export interface Bid {
  bidder: `0x${string}`;
  bidPrice: number;
}

export interface Nft {
  // Property data
  propertyId: number;
  uri?: string;

  // Listing data
  sellPrice?: number;
  buyerApproved?: boolean;
  sellerApproved?: boolean;
  bids?: BidResult[];
  acceptedBid?: BidResult;

  // Pinata data
  owner: `0x${string}` | undefined;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  addititonalFeatures: string;
  price: number;
  forSale: boolean;
  images: string[];
}

export interface PinataContent {
  owner: `0x${string}` | undefined;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  addititonalFeatures: string;
  price: number;
  images: string[];
}

interface PinataMetadata {
  name: string;
  keyvalues: {
    ownerAddress: `0x${string}` | undefined;
  };
}

export interface AddPropertyProps {
  address: `0x${string}` | undefined;
  pinataContent: PinataContent;
  pinataMetadata: PinataMetadata;
}

export interface ListingProps {
  address: `0x${string}` | undefined;
  id: number | undefined;
  sellPrice?: number;
}

export interface BidProps {
  address: `0x${string}` | undefined;
  id: number | undefined;
  bidder?: `0x${string}`;
  bidPrice?: number;
}
