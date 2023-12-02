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

export async function addProperty(
  dapp: ethers.Contract,
  address: string,
  uri: string,
  price: number
): Promise<void> {
  return dapp.addProperty(address, uri, ethers.toBigInt(price));
}
