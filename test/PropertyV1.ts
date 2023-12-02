import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("PropertyV1", function () {
  async function fixture() {
    const Property = await ethers.getContractFactory("PropertyV1");
    const [owner, otherAccount] = await ethers.getSigners();
    const property = await upgrades.deployProxy(Property);
    await property.waitForDeployment();
    const dummyData = {
      street: "first street",
      city: "first city",
      state: "first state",
      zipCode: 912345,
      yearBuilt: 2000,
      squareFootage: 2000,
      bedrooms: 4,
      bathrooms: 3,
      cost: 1200000,
    };

    return { property, owner, otherAccount, dummyData };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { property, owner } = await loadFixture(fixture);
      expect(await property.owner()).to.equal(owner.address);
    });
  });

  describe("Add property", function () {
    it("Should add a new property", async function () {
      const { property, owner, dummyData } = await loadFixture(fixture);
      await expect(
        property.addProperty(
          owner.address,
          dummyData.street,
          dummyData.city,
          dummyData.state,
          dummyData.zipCode,
          dummyData.yearBuilt,
          dummyData.squareFootage,
          dummyData.bedrooms,
          dummyData.bathrooms,
          dummyData.cost
        )
      )
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      expect(await property.ownerOf(1)).to.equal(owner.address);
      const dummyProperty = await property.properties(1);
      expect(dummyProperty.cost).to.equal(dummyData.cost);
      expect(dummyProperty.wantSell).to.equal(false);
    });

    it("Should fail if the cost is 0", async function () {
      const { property, owner, dummyData } = await loadFixture(fixture);
      await expect(
        property.addProperty(
          owner.address,
          dummyData.street,
          dummyData.city,
          dummyData.state,
          dummyData.zipCode,
          dummyData.yearBuilt,
          dummyData.squareFootage,
          dummyData.bedrooms,
          dummyData.bathrooms,
          0
        )
      ).to.be.revertedWith("Cost cannot be zero");
    });

    it("Should fail if street is empty", async function () {
      const { property, owner, dummyData } = await loadFixture(fixture);
      await expect(
        property.addProperty(
          owner.address,
          "",
          dummyData.city,
          dummyData.state,
          dummyData.zipCode,
          dummyData.yearBuilt,
          dummyData.squareFootage,
          dummyData.bedrooms,
          dummyData.bathrooms,
          dummyData.cost
        )
      ).to.be.revertedWith("Street cannot be empty");
    });

    it("Should fail if city is empty", async function () {
      const { property, owner, dummyData } = await loadFixture(fixture);
      await expect(
        property.addProperty(
          owner.address,
          dummyData.street,
          "",
          dummyData.state,
          dummyData.zipCode,
          dummyData.yearBuilt,
          dummyData.squareFootage,
          dummyData.bedrooms,
          dummyData.bathrooms,
          dummyData.cost
        )
      ).to.be.revertedWith("City cannot be empty");
    });

    it("Should fail if state is empty", async function () {
      const { property, owner, dummyData } = await loadFixture(fixture);
      await expect(
        property.addProperty(
          owner.address,
          dummyData.street,
          dummyData.city,
          "",
          dummyData.zipCode,
          dummyData.yearBuilt,
          dummyData.squareFootage,
          dummyData.bedrooms,
          dummyData.bathrooms,
          dummyData.cost
        )
      ).to.be.revertedWith("State cannot be empty");
    });
  });

  describe("Remove property", function () {
    it("should remove a property", async function () {
      const { property, owner, dummyData } = await loadFixture(fixture);

      await expect(
        property.addProperty(
          owner.address,
          dummyData.street,
          dummyData.city,
          dummyData.state,
          dummyData.zipCode,
          dummyData.yearBuilt,
          dummyData.squareFootage,
          dummyData.bedrooms,
          dummyData.bathrooms,
          dummyData.cost
        )
      )
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await expect(property.removeProperty(1))
        .to.emit(property, "Remove")
        .withArgs(owner.address, 1);
    });

    it("should fail if the property does not exist", async function () {
      const { property } = await loadFixture(fixture);
      await expect(property.removeProperty(1)).to.be.revertedWith(
        "Property with this ID does not exist"
      );
    });
  });

  describe("Transfer property", function () {
    it("Agree on buyer", async function () {
      const { property, owner, otherAccount, dummyData } = await loadFixture(
        fixture
      );
      expect(
        property.addProperty(
          owner.address,
          dummyData.street,
          dummyData.city,
          dummyData.state,
          dummyData.zipCode,
          dummyData.yearBuilt,
          dummyData.squareFootage,
          dummyData.bedrooms,
          dummyData.bathrooms,
          dummyData.cost
        )
      )
        .to.emit(property, "Add")
        .withArgs(owner.address, 1);
      await property.agreeOnBuyer(1, otherAccount.address);
      expect((await property.properties(1)).buyer).to.equal(
        otherAccount.address
      );
    });
  });
});
