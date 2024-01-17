import fs from "fs";
import path from "path";
import { artifacts } from "hardhat";
import { ethers, upgrades } from "hardhat";
import { Contract, ContractFactory } from "ethers";

// TODO: Update this with the actual artifact name
const artifactName = "PropertyV1_1";

async function main(): Promise<void> {
  const Property: ContractFactory = await ethers.getContractFactory(
    artifactName
  );
  const proxy = await upgrades.deployProxy(Property);
  await proxy.waitForDeployment();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    await proxy.getAddress()
  );

  console.log("Proxy contract address: " + (await proxy.getAddress()));
  console.log("Implementation contract address: " + implementationAddress);

  // We also save the contract's artifacts and address in the frontend directory
  await saveFrontendFiles(proxy);
}

async function saveFrontendFiles(proxy: Contract) {
  const contractsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "contracts"
  );

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(
      {
        Proxy: await proxy.getAddress(),
        Implementation: await upgrades.erc1967.getImplementationAddress(
          await proxy.getAddress()
        ),
      },
      undefined,
      2
    )
  );

  const implementationArtifact = artifacts.readArtifactSync(artifactName);

  fs.writeFileSync(
    path.join(contractsDir, `${artifactName}.json`),
    JSON.stringify(implementationArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
