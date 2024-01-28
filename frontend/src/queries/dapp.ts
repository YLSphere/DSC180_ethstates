import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import propertyArtifact from "../contracts/EthState.json";

export async function initializeDapp(address: `0x${string}` | undefined) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(
    contractAddress.Proxy,
    propertyArtifact.abi,
    await provider.getSigner(address)
  );
}

export async function getAllPropertiesForSale(
  address: `0x${string}` | undefined
) {
  const dapp = await initializeDapp(address);
  return dapp.getPropertiesForSale();
}
