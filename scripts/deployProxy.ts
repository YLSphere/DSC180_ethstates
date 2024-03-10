import fs from "fs";
import path from "path";
import { artifacts } from "hardhat";
import { ethers, upgrades } from "hardhat";
import { Contract, ContractFactory } from "ethers";

// TODO: Update this with the actual artifact name
const financingName = "FinancingContract";
const marketplaceName = "ListingContract";

async function main(): Promise<void> {
  const Financing: ContractFactory = await ethers.getContractFactory(
    "FinancingContract"
  );
  const financingProxy = await upgrades.deployProxy(Financing, []);
  await financingProxy.waitForDeployment();
  const financingAddress = await upgrades.erc1967.getImplementationAddress(
    await financingProxy.getAddress()
  );

  console.log(
    "Proxy (financing) contract address: " + (await financingProxy.getAddress())
  );
  console.log("financing contract address: " + financingAddress);

  const Marketplace: ContractFactory = await ethers.getContractFactory(
    marketplaceName
  );
  const marketplaceProxy = await upgrades.deployProxy(Marketplace, [
    await financingProxy.getAddress(),
  ]);
  await marketplaceProxy.waitForDeployment();
  const marketplaceAddress = await upgrades.erc1967.getImplementationAddress(
    await marketplaceProxy.getAddress()
  );

  console.log(
    "Proxy (marketplace) contract address: " +
      (await marketplaceProxy.getAddress())
  );
  console.log("Marketplace contract address: " + marketplaceAddress);

  // We also save the contract's artifacts and address in the frontend directory
  await saveFrontendFiles([
    [financingName, financingProxy],
    [marketplaceName, marketplaceProxy],
  ]);
}

async function saveFrontendFiles(proxies: [string, Contract][]) {
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

  let addresses = {};
  for (const [name, proxy] of proxies) {
    const proxyAddress = await proxy.getAddress();
    addresses[`${name}Proxy`] = proxyAddress;
    addresses[`${name}Implementation`] =
      await upgrades.erc1967.getImplementationAddress(proxyAddress);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(addresses, undefined, 2)
  );

  for (const [name, proxy] of proxies) {
    const implementationArtifact = await artifacts.readArtifact(name);
    fs.writeFileSync(
      path.join(contractsDir, `${name}.json`),
      JSON.stringify(implementationArtifact, null, 2)
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
