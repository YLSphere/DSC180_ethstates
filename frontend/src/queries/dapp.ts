import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import financingArtifact from "../contracts/FinancingContract.json";
import marketplaceArtifact from "../contracts/ListingContract.json";

export async function getMarketplaceContract(address: `0x${string}`) {
  // const provider = new ethers.BrowserProvider(
  //   window.ethereum,
  //   new Network("matic-mumbai", 80001)
  // );
  const provider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_ALCHEMY_MUMBAI_URL
  );
  return new ethers.Contract(
    contractAddress.ListingContractProxy,
    marketplaceArtifact.abi,
    // await provider.getSigner(address)
    new ethers.JsonRpcSigner(provider, address)
  );
}

export async function getFinancingContract(address: `0x${string}`) {
  // const provider = new ethers.BrowserProvider(
  //   window.ethereum,
  //   new Network("matic-mumbai", 80001)
  // );
  const provider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_ALCHEMY_MUMBAI_URL
  );
  return new ethers.Contract(
    contractAddress.FinancingContractProxy,
    financingArtifact.abi,
    // await provider.getSigner(address)
    new ethers.JsonRpcSigner(provider, address)
  );
}
