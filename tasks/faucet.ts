import { task } from "hardhat/config";

task("faucet", "Sends ETH to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }, { ethers }) => {
    const [sender] = await ethers.getSigners();
    const tx = await sender.sendTransaction({
      to: receiver,
      value: ethers.WeiPerEther,
    });
    await tx.wait();
    console.log(`Transferred 1.0 ETH to ${receiver}`);
  });
