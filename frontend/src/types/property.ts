export interface PropertyResult {
  0: bigint; // propertyId
  1: bigint; // price
  2: string; // uri
}

export enum PropertyResultIndex {
  PROPERTY_ID,
  PRICE,
  URI,
}

export interface Property {
  propertyId: number;
  price: number;
  uri: string;
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
  price?: number;
  images: string[];
}

interface PinataMetadata {
  name: string;
}

export interface AddPropertyProps {
  address: `0x${string}` | undefined;
  pinataContent: PinataContent;
  pinataMetadata: PinataMetadata;
}
