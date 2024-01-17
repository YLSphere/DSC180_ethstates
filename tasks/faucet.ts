import { task } from "hardhat/config";

task("faucet", "Sends ETH to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .addPositionalParam("amount", "The amount of ETH to send")
  .setAction(async ({ receiver, amount }, { ethers }) => {
    const [sender] = await ethers.getSigners();
    const tx = await sender.sendTransaction({
      to: receiver,
      value: ethers.toBigInt(parseInt(amount)) * ethers.WeiPerEther,
    });
    await tx.wait();
    console.log(`Transferred ${amount} ETH to ${receiver}`);
  });
