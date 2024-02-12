import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import financingArtifact from "../contracts/FinancingContract.json";
import marketplaceArtifact from "../contracts/ListingContract.json";

export async function getMarketplaceContract(address: `0x${string}` | undefined) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(
    contractAddress.ListingContractProxy,
    marketplaceArtifact.abi,
    await provider.getSigner(address)
  );
}

export async function getFinancingContract(address: `0x${string}` | undefined) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(
    contractAddress.FinancingContractProxy,
    financingArtifact.abi,
    await provider.getSigner(address)
  );
}
