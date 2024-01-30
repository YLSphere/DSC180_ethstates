import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import propertyArtifact from "../contracts/PropertyV1.json";

export async function initializeDapp(address: `0x${string}` | undefined) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(
    contractAddress.Proxy,
    propertyArtifact.abi,
    await provider.getSigner(address)
  );
}

export async function propertyCount(address: `0x${string}` | undefined) {
  const dapp = await initializeDapp(address);
  return dapp.propertyCount();
}

export async function addProperty(
  address: `0x${string}` | undefined,
  uri: string,
  price: number
) {
  const dapp = await initializeDapp(address);
  return dapp.addProperty(uri, ethers.toBigInt(price));
}

export async function getAllPropertiesByOwner(
  address: `0x${string}` | undefined
) {
  const dapp = await initializeDapp(address);
  return dapp.getPropertiesByOwner(address);
}

export async function getAllPropertiesForSale(
  address: `0x${string}` | undefined
) {
  const dapp = await initializeDapp(address);
  return dapp.getPropertiesForSale();
}