// import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { ethers, upgrades } from "hardhat";
// import { expect } from "chai";

// describe("PropertyV1_1", function () {
//   async function fixture() {
//     const Property = await ethers.getContractFactory("PropertyV1_1");
//     const [owner, otherAccount] = await ethers.getSigners();
//     const property = await upgrades.deployProxy(Property);
//     await property.waitForDeployment();
//     const dummyData = {
//       uri: "ipfs hash",
//       cost: 1_200_000,
//     };

//     return { property, owner, otherAccount, dummyData };
//   }

//   describe("Deployment", function () {
//     it("Should set the right owner", async function () {
//       const { property, owner } = await loadFixture(fixture);
//       expect(await property.owner()).to.equal(owner.address);
//     });
//   });

//   describe("Add property", function () {
//     it("Should add a new property", async function () {
//       const { property, owner, dummyData } = await loadFixture(fixture);
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       expect(await property.ownerOf(1)).to.equal(owner.address);
//       const dummyProperty = await property.properties(1);
//       expect(dummyProperty.cost).to.equal(dummyData.cost);
//       expect(dummyProperty.wantSell).to.equal(false);
//     });
//   });

//   describe("Remove property", function () {
//     it("should remove a property", async function () {
//       const { property, owner, dummyData } = await loadFixture(fixture);
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await expect(property.removeProperty(1))
//         .to.emit(property, "Remove")
//         .withArgs(owner.address, 1);
//     });
//   });

//   describe("Make a bid offer", function () {
//     it("should make a bid offer", async function () {
//       const { property, owner, otherAccount, dummyData } = await loadFixture(
//         fixture
//       );
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await property.listPropertyForSale(1);
//       console.log(await property.getBids(1));
//       await expect(property.connect(otherAccount).bid(1, dummyData.cost + 1))
//         .to.emit(property, "Offer")
//         .withArgs(otherAccount.address, 1, dummyData.cost + 1);
//     });

//     it("should fail if the property is not for sale", async function () {
//       const { property, owner, otherAccount, dummyData } = await loadFixture(
//         fixture
//       );
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await expect(
//         property.connect(otherAccount).bid(1, dummyData.cost + 1)
//       ).to.be.revertedWith("Property is not available for sale");
//     });

//     it("should fail if the bid is less than the cost", async function () {
//       const { property, owner, otherAccount, dummyData } = await loadFixture(
//         fixture
//       );
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await property.listPropertyForSale(1);
//       await expect(
//         property.connect(otherAccount).bid(1, dummyData.cost - 1)
//       ).to.be.revertedWith("Insufficient payment");
//     });

//     it("should fail if the property does not exist", async function () {
//       const { property, otherAccount, dummyData } = await loadFixture(fixture);
//       await expect(
//         property.connect(otherAccount).bid(1, dummyData.cost + 1)
//       ).to.be.revertedWith("Property with this ID does not exist");
//     });

//     it("should fail if the buyer is owner", async function () {
//       const { property, owner, dummyData } = await loadFixture(fixture);
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await property.listPropertyForSale(1);
//       await expect(property.bid(1, dummyData.cost + 1)).to.be.revertedWith(
//         "Buyer cannot be owner"
//       );
//     });

//     it("should fail if the buyer already bid on the property", async function () {
//       const { property, owner, otherAccount, dummyData } = await loadFixture(
//         fixture
//       );
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await property.listPropertyForSale(1);
//       await property.connect(otherAccount).bid(1, dummyData.cost + 1);
//       await expect(
//         property.connect(otherAccount).bid(1, dummyData.cost + 1)
//       ).to.be.revertedWith("Buyer already bid on this property");
//     });
//   });

//   describe("Accept a bid offer", function () {
//     it("should accept a bid offer", async function () {
//       const { property, owner, otherAccount, dummyData } = await loadFixture(
//         fixture
//       );
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await property.listPropertyForSale(1);
//       await property.connect(otherAccount).bid(1, dummyData.cost + 1);
//       await expect(property.agreeOnBuyer(1, otherAccount.address))
//         .to.emit(property, "AcceptBid")
//         .withArgs(owner.address, otherAccount.address, 1);
//     });

//     it("should fail if the buyer is not the one who made the bid", async function () {
//       const { property, owner, otherAccount, dummyData } = await loadFixture(
//         fixture
//       );
//       await expect(property.addProperty(dummyData.uri, dummyData.cost))
//         .to.emit(property, "Add")
//         .withArgs(owner.address, 1);
//       await property.listPropertyForSale(1);
//       await property.connect(otherAccount).bid(1, dummyData.cost + 1);
//       await expect(property.agreeOnBuyer(1, owner.address)).to.be.revertedWith(
//         "Buyer not found in bids"
//       );
//     });
//   });
// });
