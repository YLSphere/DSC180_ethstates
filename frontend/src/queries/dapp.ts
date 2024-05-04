import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import financingArtifact from "../contracts/FinancingContract.json";
import marketplaceArtifact from "../contracts/ListingContract.json";

export async function getMarketplaceContract(address: `0x${string}`) {
  const provider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_ALCHEMY_AMONY_URL
  );
  return new ethers.Contract(
    contractAddress.ListingContractProxy,
    marketplaceArtifact.abi,
    new ethers.JsonRpcSigner(provider, address)
  );
}

export async function getFinancingContract(address: `0x${string}`) {
  const provider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_ALCHEMY_AMONY_URL
  );
  return new ethers.Contract(
    contractAddress.FinancingContractProxy,
    financingArtifact.abi,
    new ethers.JsonRpcSigner(provider, address)
  );
}
