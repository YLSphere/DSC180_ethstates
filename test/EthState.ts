import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("EthState", function () {
  async function fixture() {
    const Financing = await ethers.getContractFactory("FinancingContract");
    const financingAddress = await (await Financing.deploy()).getAddress();
    const Property = await ethers.getContractFactory("EthState");
    const [owner, user1, user2] = await ethers.getSigners();
    const property = await upgrades.deployProxy(Property, [financingAddress]);
    await property.waitForDeployment();

    const propertyData = {
      uri: "ipfs hash",
    };

    const listingData = {
      sellPrice: 1_200_000,
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

    return { property, owner, user1, user2, propertyData, listingData };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { property, owner } = await loadFixture(fixture);
      expect(await property.owner()).to.equal(owner.address);
    });
  });

  describe("Add property", function () {
    it("Should add a new property", async function () {
      const { property, owner, propertyData } = await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      expect(await property.ownerOf(1)).to.equal(owner.address);
      expect(await property.tokenURI(1)).to.equal("ipfs hash");
    });
  });

  describe("Remove property", function () {
    it("should remove a property", async function () {
      const { property, owner, propertyData } = await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.removeProperty(1))
        .to.emit(property, "Remove")
        .withArgs(owner.address, 1);
    });
  });

  describe("List property for sale", function () {
    it("should list a property for sale", async function () {
      const { property, owner, propertyData, listingData } = await loadFixture(
        fixture
      );
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      const listing = await property.listings(1);
      expect(listing.sellPrice).to.equal(listingData.sellPrice);
      expect(listing.buyerApproved).to.equal(false);
      expect(listing.sellerApproved).to.equal(false);
    });

    it("should fail if the property is not owned by the caller", async function () {
      const { property, owner, user1, propertyData, listingData } =
        await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(
        property.connect(user1).listProperty(1, listingData.sellPrice)
      ).to.be.revertedWith("Caller is not the owner of this property");
    });

    it("should fail if the property is already listed", async function () {
      const { property, owner, propertyData, listingData } = await loadFixture(
        fixture
      );
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);
      await expect(
        property.listProperty(1, listingData.sellPrice)
      ).to.be.revertedWithCustomError(property, "PropertyAlreadyListed");
    });

    it("should fail if the property does not exist", async function () {
      const { property, listingData } = await loadFixture(fixture);
      await expect(
        property.listProperty(1, listingData.sellPrice)
      ).to.be.revertedWith("Property with this ID does not exist");
    });

    it("should fail if the sell price is 0", async function () {
      const { property, owner, propertyData } = await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.listProperty(1, 0)).to.be.revertedWithCustomError(
        property,
        "PriceNotMet"
      );
    });
  });

  describe("Place a bid", function () {
    it("should place a bid", async function () {
      const { property, owner, user1, propertyData, listingData } =
        await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);
      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);
    });

    it("should fail if the property is not for sale", async function () {
      const { property, owner, user1, propertyData, listingData } =
        await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(
        property.connect(user1).bid(1, listingData.bids[0].price)
      ).to.be.revertedWithCustomError(property, "PropertyNotListed");
    });

    it("should fail if the bidder is the owner", async function () {
      const { property, owner, propertyData, listingData } = await loadFixture(
        fixture
      );
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);
      await expect(
        property.bid(1, listingData.bids[0].price)
      ).to.be.revertedWith("Owner cannot bid");
    });

    it("should fail if the bidder already bid on the property", async function () {
      const { property, owner, user1, propertyData, listingData } =
        await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);
      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);
      await expect(
        property.connect(user1).bid(1, listingData.bids[0].price)
      ).to.be.revertedWithCustomError(property, "BuyerAlreadyBid");
    });

    it("should fail if property unlisted while bidding", async function () {
      const { property, owner, user1, propertyData, listingData } =
        await loadFixture(fixture);
      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);

      await expect(property.unlistProperty(1))
        .to.emit(property, "Unlist")
        .withArgs(owner.address, 1);

      await expect(
        property.connect(user1).bid(1, listingData.bids[0].price)
      ).to.be.revertedWithCustomError(property, "PropertyNotListed");
    });
  });

  describe("Accept an offer", function () {
    it("should accept an offer", async function () {
      const { property, owner, user1, user2, propertyData, listingData } =
        await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);

      await expect(property.connect(user2).bid(1, listingData.bids[1].price))
        .to.emit(property, "Offer")
        .withArgs(user2.address, 1, listingData.bids[1].price);

      await expect(property.acceptOffer(1, user1.address))
        .to.emit(property, "Accept")
        .withArgs(owner.address, 1, listingData.bids[0].price);

      const listing = await property.listings(1);
      expect(listing.sellerApproved).to.equal(true);
      expect(listing.buyerApproved).to.equal(false);
    });

    it("should fail if the caller is not the owner", async function () {
      const { property, owner, user1, user2, propertyData, listingData } =
        await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);

      await expect(
        property.connect(user1).acceptOffer(1, user1.address)
      ).to.be.revertedWith("Caller is not the owner of this property");
    });

    it("should fail if the property is not listed", async function () {
      const { property, owner, user1, propertyData } = await loadFixture(
        fixture
      );

      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(
        property.acceptOffer(1, user1.address)
      ).to.be.revertedWithCustomError(property, "PropertyNotListed");
    });

    it("should fail if the property doesn't exist", async function () {
      const { property, user1 } = await loadFixture(fixture);

      await expect(property.acceptOffer(1, user1.address)).to.be.revertedWith(
        "Property with this ID does not exist"
      );
    });

    it("shoulf fail if the bid doesn't exist", async function () {
      const { property, owner, user1, propertyData, listingData } =
        await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      await expect(
        property.acceptOffer(1, user1.address)
      ).to.be.revertedWithCustomError(property, "BuyerDidNotBid");
    });
  });

  describe("Buyer approve a transfer", function () {
    it("should approve a transfer", async function () {
      const { property, owner, user1, user2, propertyData, listingData } =
        await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);

      await expect(property.acceptOffer(1, user1.address))
        .to.emit(property, "Accept")
        .withArgs(owner.address, 1, listingData.bids[0].price);

      const ownerBalance = await ethers.provider.getBalance(owner.address);
      const user1Balance = await ethers.provider.getBalance(user1.address);

      expect(
        await property
          .connect(user1)
          .approveTransferAsBuyer(1, { value: listingData.bids[0].price })
      )
        .to.emit(property, "Transfer")
        .withArgs(owner.address, user1.address, 1, listingData.bids[0].price);
      expect(await property.ownerOf(1)).to.equal(user1.address);
      expect(await ethers.provider.getBalance(owner.address)).to.equal(
        ownerBalance + BigInt(listingData.bids[0].price)
      );
      expect(
        await ethers.provider.getBalance(user1.address)
      ).to.lessThanOrEqual(user1Balance - BigInt(listingData.bids[0].price));
    });

    it("should fail if the caller is not the buyer", async function () {
      const { property, owner, user1, user2, propertyData, listingData } =
        await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);

      await expect(property.acceptOffer(1, user1.address))
        .to.emit(property, "Accept")
        .withArgs(owner.address, 1, listingData.bids[0].price);

      await expect(
        property.connect(owner).approveTransferAsBuyer(1, {
          value: listingData.bids[0].price,
        })
      ).to.be.revertedWithCustomError(property, "NotAcceptedBuyer");
    });
  });

  describe("Buy a property with financing", function () {
    it("should receive fund with financing", async function () {
      const { property, owner, user1, user2, propertyData, listingData } =
        await loadFixture(fixture);

      await expect(property.addProperty(propertyData.uri))
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);

      await expect(property.listProperty(1, listingData.sellPrice))
        .to.emit(property, "List")
        .withArgs(owner.address, 1, listingData.sellPrice);

      await expect(property.connect(user1).bid(1, listingData.bids[0].price))
        .to.emit(property, "Offer")
        .withArgs(user1.address, 1, listingData.bids[0].price);

      await expect(property.acceptOffer(1, user1.address))
        .to.emit(property, "Accept")
        .withArgs(owner.address, 1, listingData.bids[0].price);

      const financing = await ethers.getContractAt(
        "IFinancing",
        await property.financingContract()
      );
      await expect(
        financing.connect(user2).addLoan(user2.address, 500)
      ).to.emit(financing, "LoanAdded");
      await expect(
        financing.connect(user1).financingRequest(1, 1, 1_000_000, 1)
      )
        .to.emit(financing, "FinanceRequest")
        .withArgs(user2.address, user1.address, 1);

      const user1Balance = await ethers.provider.getBalance(user1.address);
      await expect(
        financing.connect(user2).approveFinancing(1, { value: 1_000_000 })
      )
        .to.emit(financing, "FinanceApproval")
        .withArgs(user2.address, user1.address, 1);
      expect(
        await ethers.provider.getBalance(user1.address)
      ).to.be.lessThanOrEqual(user1Balance + BigInt(1_000_000));
    });

    it("should add a loan", async function () {
      const { property, user2 } = await loadFixture(fixture);

      const financing = await ethers.getContractAt(
        "IFinancing",
        await property.financingContract()
      );
      await expect(
        financing.connect(user2).addLoan(user2.address, 500)
      ).to.emit(financing, "LoanAdded");
    });

    it("should request financing", async function () {
      const { property, user1, user2 } = await loadFixture(fixture);

      const financing = await ethers.getContractAt(
        "IFinancing",
        await property.financingContract()
      );
      await expect(
        financing.connect(user2).addLoan(user2.address, 500)
      ).to.emit(financing, "LoanAdded");
      await expect(
        financing.connect(user1).financingRequest(1, 1, 1_000_000, 1)
      )
        .to.emit(financing, "FinanceRequest")
        .withArgs(user2.address, user1.address, 1);
    });
  });
});
