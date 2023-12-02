import { ethers, upgrades } from "hardhat";

// TO DO: Place the address of your proxy here!
const proxyAddress = "0x0696415dE53e87fBF9EEd8DB6007D01451996A42";

async function main(): Promise<void> {
  const PropertyV2 = await ethers.getContractFactory("PropertyV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, PropertyV2);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log("The current contract owner is: " + await upgraded.owner());
  console.log("Implementation contract address: " + implementationAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
