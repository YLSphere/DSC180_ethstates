export interface Result {
  0: number; // price
  1: number; // propertyId
  2: string; // uri
  3: `0x${string}`; // buyer
  4: boolean; // wantSell
  5: boolean; // buyerApproved
  6: boolean; // sellerApproved
}

export enum ResultIndex {
  PRICE,
  PROPERTY_ID,
  URI,
  BUYER,
  WANT_SELL,
  BUYER_APPROVED,
  SELLER_APPROVED,
}

export interface Nft {
  propertyId: number;
  uri?: string;
  buyer?: `0x${string}`;
  wantSell?: boolean;
  buyerApproved?: boolean;
  sellerApproved?: boolean;
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

export interface SaleProps {
  address: `0x${string}` | undefined;
  id: number | undefined;
}
