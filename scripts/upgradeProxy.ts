import { ethers, upgrades, artifacts } from "hardhat";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// TO DO: Place the address of your proxy here!
const name = "FinancingContract";
const proxyAddress = "0x367Cf6cAb7478966f93AcD210f86564AA9d4c057";

async function main(): Promise<void> {
  const Contract = await ethers.getContractFactory(name);
  const upgraded = await upgrades.upgradeProxy(proxyAddress, Contract);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log("The current contract owner is: " + (await upgraded.owner()));
  console.log("Implementation contract address: " + implementationAddress);

  await updateImplementationAddress(implementationAddress);
}

async function updateImplementationAddress(newAddress: string) {
  const contractsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "contracts"
  );

  try {
    // Read the existing file
    const data = await readFile(
      path.join(contractsDir, "contract-address.json"),
      "utf8"
    );
    const addresses = JSON.parse(data);

    // Update the address
    addresses.FinancingContractImplementation = newAddress;

    // Write the updated JSON back to the file
    await writeFile(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify(addresses, null, 2),
      "utf8"
    );
    console.log("Implementation address updated successfully.");

    const implementationArtifact = await artifacts.readArtifact(name);
    fs.writeFileSync(
      path.join(contractsDir, `${name}.json`),
      JSON.stringify(implementationArtifact, null, 2)
    );
  } catch (error) {
    console.error("Error updating the implementation address:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
