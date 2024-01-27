import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("EthState", function () {
  async function fixture() {
    const Property = await ethers.getContractFactory("EthState");
    const [owner, user1, user2] = await ethers.getSigners();
    const property = await upgrades.deployProxy(Property);
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
      ).to.be.revertedWith("Property is already listed");
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
      await expect(property.listProperty(1, 0)).to.be.revertedWith(
        "Sell price cannot be zero"
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
      ).to.be.revertedWith("Property is not listed");
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
      ).to.be.revertedWith("Buyer cannot be owner");
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
      ).to.be.revertedWith("Buyer already bid on this property");
    });
  });
});
