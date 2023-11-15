import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";

async function main(): Promise<void> {
  const Property: ContractFactory = await ethers.getContractFactory("PropertyV1");
  const proxy = await upgrades.deployProxy(Property);
  await proxy.waitForDeployment();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    await proxy.getAddress()
  );

  console.log("Proxy contract address: " + (await proxy.getAddress()));

  console.log("Implementation contract address: " + implementationAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
