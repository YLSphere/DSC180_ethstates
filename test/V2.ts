import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("EthState", function () {
  async function fixture() {
    // Deploy the financing contract
    const Financing = await ethers.getContractFactory("FinancingContract");
    const financing = await upgrades.deployProxy(Financing);
    await financing.waitForDeployment();
    // Deploy the listing contract
    const Property = await ethers.getContractFactory("ListingContract");
    const [owner, user1, user2] = await ethers.getSigners();
    const property = await upgrades.deployProxy(Property, [
      await financing.getAddress(),
    ]);
    await property.waitForDeployment();

    const propertyData = {
      uri: "ipfs hash",
      price: 1_000,
    };

    const listingData = {
      bids: [
        {
          price: 1_000_000,
          bidder: user1.address,
        },
        {
          price: 1_100_000,
          bidder: user2.address,
        },
      ],
    };

    return {
      property,
      financing,
      owner,
      user1,
      user2,
      propertyData,
      listingData,
    };
  }

  // describe("Deployment", function () {
  //   it("Should set the right owner", async function () {
  //     const { property, owner } = await loadFixture(fixture);
  //     expect(await property.owner()).to.equal(owner.address);
  //   });
  // });

  // describe("Add property", function () {
  //   it("Should add a new property", async function () {
  //     const { property, owner, propertyData } = await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     expect(await property.ownerOf(1)).to.equal(owner.address);
  //     expect(await property.tokenURI(1)).to.equal("ipfs hash");
  //   });
  // });

  // describe("Remove property", function () {
  //   it("should remove a property", async function () {
  //     const { property, owner, propertyData } = await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.removeProperty(1))
  //       .to.emit(property, "Remove")
  //       .withArgs(owner.address, 1);
  //   });
  // });

  // describe("List property for sale", function () {
  //   it("should list a property for sale", async function () {
  //     const { property, owner, propertyData, listingData } = await loadFixture(
  //       fixture
  //     );
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.listProperty(1))
  //       .to.emit(property, "List")
  //       .withArgs(1);

  //     const listing = await property.listings(1);
  //     expect(listing.sellPrice).to.equal(BigInt(propertyData.price));
  //     expect(listing.buyerApproved).to.equal(false);
  //     expect(listing.sellerApproved).to.equal(false);
  //   });

  //   it("should fail if the property is not owned by the caller", async function () {
  //     const { property, owner, user1, propertyData, listingData } =
  //       await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(
  //       property.connect(user1).listProperty(1)
  //     ).to.be.revertedWithCustomError(property, "NotPropertyOwner");
  //   });

  //   it("should fail if the property is already listed", async function () {
  //     const { property, owner, propertyData } = await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.listProperty(1)).to.emit(property, "List");
  //     await expect(property.listProperty(1)).to.be.revertedWithCustomError(
  //       property,
  //       "PropertyAlreadyListed"
  //     );
  //   });

  //   it("should fail if the property does not exist", async function () {
  //     const { property, propertyData } = await loadFixture(fixture);
  //     await expect(property.listProperty(1)).to.be.revertedWithCustomError(
  //       property,
  //       "PropertyNotExists"
  //     );
  //   });

  //   it("should fail if the sell price is 0", async function () {
  //     const { property, owner, propertyData } = await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, 0))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.listProperty(1)).to.be.revertedWithCustomError(
  //       property,
  //       "PriceNotMet"
  //     );
  //   });
  // });

  // describe("Place a bid", function () {
  //   it("should place a bid", async function () {
  //     const { property, owner, user1, propertyData, listingData } =
  //       await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.listProperty(1)).to.emit(property, "List");
  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.emit(property, "Offer");
  //   });

  //   it("should fail if the property is not for sale", async function () {
  //     const { property, owner, user1, propertyData, listingData } =
  //       await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.be.revertedWithCustomError(property, "PropertyNotListed");
  //   });

  //   it("should fail if the bidder is the owner", async function () {
  //     const { property, owner, propertyData, listingData } = await loadFixture(
  //       fixture
  //     );
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.listProperty(1)).to.emit(property, "List");
  //     await expect(
  //       property.bid(1, listingData.bids[0].price)
  //     ).to.be.revertedWith("Owner cannot bid");
  //   });

  //   it("should fail if the bidder already bid on the property", async function () {
  //     const { property, owner, user1, propertyData, listingData } =
  //       await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.listProperty(1)).to.emit(property, "List");
  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.emit(property, "Offer");
  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.be.revertedWithCustomError(property, "BuyerAlreadyBid");
  //   });

  //   it("should fail if property unlisted while bidding", async function () {
  //     const { property, owner, user1, propertyData, listingData } =
  //       await loadFixture(fixture);
  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);

  //     await expect(property.listProperty(1)).to.emit(property, "List");

  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.emit(property, "Offer");

  //     await expect(property.unlistProperty(1)).to.emit(property, "Unlist");

  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.be.revertedWithCustomError(property, "PropertyNotListed");
  //   });
  // });

  // describe("Accept an offer", function () {
  //   it("should accept an offer", async function () {
  //     const { property, owner, user1, user2, propertyData, listingData } =
  //       await loadFixture(fixture);

  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);

  //     await expect(property.listProperty(1)).to.emit(property, "List");

  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.emit(property, "Offer");

  //     await expect(
  //       property.connect(user2).bid(1, listingData.bids[1].price)
  //     ).to.emit(property, "Offer");

  //     await expect(property.acceptOffer(1, user1.address)).to.emit(
  //       property,
  //       "Accept"
  //     );

  //     const listing = await property.listings(1);
  //     expect(listing.sellerApproved).to.equal(true);
  //     expect(listing.buyerApproved).to.equal(false);
  //   });

  //   it("should fail if the caller is not the owner", async function () {
  //     const { property, owner, user1, user2, propertyData, listingData } =
  //       await loadFixture(fixture);

  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);

  //     await expect(property.listProperty(1)).to.emit(property, "List");

  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.emit(property, "Offer");

  //     await expect(
  //       property.connect(user1).acceptOffer(1, user1.address)
  //     ).to.be.revertedWithCustomError(property, "NotPropertyOwner");
  //   });

  //   it("should fail if the property is not listed", async function () {
  //     const { property, owner, user1, propertyData } = await loadFixture(
  //       fixture
  //     );

  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);

  //     await expect(
  //       property.acceptOffer(1, user1.address)
  //     ).to.be.revertedWithCustomError(property, "PropertyNotListed");
  //   });

  //   it("should fail if the property doesn't exist", async function () {
  //     const { property, user1 } = await loadFixture(fixture);

  //     await expect(
  //       property.acceptOffer(1, user1.address)
  //     ).to.be.revertedWithCustomError(property, "PropertyNotExists");
  //   });

  //   it("shoulf fail if the bid doesn't exist", async function () {
  //     const { property, owner, user1, propertyData, listingData } =
  //       await loadFixture(fixture);

  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);

  //     await expect(property.listProperty(1)).to.emit(property, "List");

  //     await expect(
  //       property.acceptOffer(1, user1.address)
  //     ).to.be.revertedWithCustomError(property, "BuyerDidNotBid");
  //   });
  // });

  // describe("Buyer approve a transfer", function () {
  //   it("should approve a transfer", async function () {
  //     const { property, owner, user1, user2, propertyData, listingData } =
  //       await loadFixture(fixture);

  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);

  //     await expect(property.listProperty(1)).to.emit(property, "List");

  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.emit(property, "Offer");

  //     await expect(property.acceptOffer(1, user1.address)).to.emit(
  //       property,
  //       "Accept"
  //     );

  //     const ownerBalance = await ethers.provider.getBalance(owner.address);
  //     const user1Balance = await ethers.provider.getBalance(user1.address);

  //     expect(
  //       await property
  //         .connect(user1)
  //         .approveTransferAsBuyer(1, { value: listingData.bids[0].price })
  //     )
  //       .to.emit(property, "Transfer")
  //       .withArgs(owner.address, user1.address, 1);
  //     expect(await property.ownerOf(1)).to.equal(user1.address);
  //     expect(await ethers.provider.getBalance(owner.address)).to.equal(
  //       ownerBalance + BigInt(listingData.bids[0].price)
  //     );
  //     expect(
  //       await ethers.provider.getBalance(user1.address)
  //     ).to.lessThanOrEqual(user1Balance - BigInt(listingData.bids[0].price));
  //   });

  //   it("should fail if the caller is not the buyer", async function () {
  //     const { property, owner, user1, user2, propertyData, listingData } =
  //       await loadFixture(fixture);

  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);

  //     await expect(property.listProperty(1)).to.emit(property, "List");

  //     await expect(
  //       property.connect(user1).bid(1, listingData.bids[0].price)
  //     ).to.emit(property, "Offer");

  //     await expect(property.acceptOffer(1, user1.address)).to.emit(
  //       property,
  //       "Accept"
  //     );

  //     await expect(
  //       property.connect(owner).approveTransferAsBuyer(1, {
  //         value: listingData.bids[0].price,
  //       })
  //     ).to.be.revertedWithCustomError(property, "NotAcceptedBuyer");
  //   });
  // });

  describe("Buy a property with financing", function () {
    it("should receive fund with financing", async function () {
      const {
        property,
        financing,
        owner,
        user1,
        user2,
        propertyData,
        listingData,
      } = await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri, propertyData.price))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1)).to.emit(property, "List");

      await expect(
        property.connect(user1).bid(1, listingData.bids[0].price)
      ).to.emit(property, "Offer");

      await expect(property.acceptOffer(1, user1.address)).to.emit(
        property,
        "Accept"
      );

      await expect(financing.connect(user2).addLoan(user2.address, 500, 2))
        .to.emit(financing, "LoanAdded")
        .withArgs(1);
      await expect(
        property
          .connect(user1)
          .requestFinancing(1, 1, ethers.parseEther("1"), 1)
      )
        .to.emit(financing, "FinanceRequest")
        .withArgs(user2.address, user1.address, 1);

      const user1Balance = await ethers.provider.getBalance(user1.address);
      await expect(
        financing
          .connect(user2)
          .approveFinancing(1, { value: ethers.parseEther("1") })
      )
        .to.emit(financing, "FinanceApproval")
        .withArgs(user2.address, user1.address, 1);

      expect(await ethers.provider.getBalance(user1.address)).to.be.greaterThan(
        user1Balance
      );
      expect(
        await ethers.provider.getBalance(user1.address)
      ).to.be.lessThanOrEqual(user1Balance + ethers.parseEther("1"));
    });

    it("should add a loan", async function () {
      const { property, financing, user2 } = await loadFixture(fixture);

      await expect(
        financing.connect(user2).addLoan(user2.address, 500, 2)
      ).to.emit(financing, "LoanAdded");
    });

    it("should fail if property does not exists", async function () {
      const { property, financing, user1, user2 } = await loadFixture(fixture);

      await expect(
        financing.connect(user2).addLoan(user2.address, 500, 2)
      ).to.emit(financing, "LoanAdded");
      await expect(
        property.connect(user1).requestFinancing(1, 1, 1_000_000, 1)
      ).to.revertedWithCustomError(property, "PropertyNotExists");
    });

    it("should update financing info", async function () {
      const {
        property,
        financing,
        owner,
        user1,
        user2,
        propertyData,
        listingData,
      } = await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri, propertyData.price))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1)).to.emit(property, "List");

      await expect(
        property.connect(user1).bid(1, listingData.bids[0].price)
      ).to.emit(property, "Offer");

      await expect(property.acceptOffer(1, user1.address)).to.emit(
        property,
        "Accept"
      );

      await expect(financing.connect(user2).addLoan(user2.address, 500, 2))
        .to.emit(financing, "LoanAdded")
        .withArgs(1);
      await expect(
        property
          .connect(user1)
          .requestFinancing(1, 1, ethers.parseEther("1"), 1)
      )
        .to.emit(financing, "FinanceRequest")
        .withArgs(user2.address, user1.address, 1);

      await expect(
        financing
          .connect(user2)
          .approveFinancing(1, { value: ethers.parseEther("1") })
      )
        .to.emit(financing, "FinanceApproval")
        .withArgs(user2.address, user1.address, 1);

      await expect(
        property
          .connect(user1)
          .approveTransferAsBuyer(1, { value: listingData.bids[0].price })
      ).to.emit(property, "Transfer");

      expect(await financing.getFinancingId(1)).equal(1);
      const financing1 = await financing.getFinancing(1);
      expect(financing1.loaner).to.equal(user1.address);
      expect(financing1.propertyId).to.equal(1);
    });
  });

  // describe("Updating property data", function () {
  //   it("should update property data", async function () {
  //     const { property, owner, propertyData } = await loadFixture(fixture);

  //     await expect(property.addProperty(propertyData.uri, propertyData.price))
  //       .to.emit(property, "Add")
  //       .withArgs(owner.address, 1);
  //     await expect(property.updateProperty(1, "new ipfs hash"))
  //       .to.emit(property, "Update")
  //       .withArgs(1);
  //     expect(await property.tokenURI(1)).to.equal("new ipfs hash");
  //   });

  //   it("should fail if the caller is not the owner", async function () {
  //     const { property, owner, user1, propertyData } = await loadFixture(
  //       fixture
  //     );

  //     await expect(property.addProperty(propertyData.uri, propertyData.price));
  //     await expect(
  //       property.connect(user1).updateProperty(1, "new ipfs hash")
  //     ).to.be.revertedWithCustomError(property, "NotPropertyOwner");
  //   });

  //   it("should fail if the property does not exist", async function () {
  //     const { property, user1 } = await loadFixture(fixture);

  //     await expect(
  //       property.connect(user1).updateProperty(1, "new ipfs hash")
  //     ).to.be.revertedWithCustomError(property, "PropertyNotExists");
  //   });
  // });
});
