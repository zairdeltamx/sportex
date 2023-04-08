const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("NFTMarket", function () {
  it("Should create a new Sale", async function () {
    const Market = await ethers.getContractFactory("NFTMarketplace");

    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddres = nft.address;

    const FakeNFTContract = await ethers.getContractFactory("NFT");
    const fakeNft = await FakeNFTContract.deploy(marketAddress);
    await fakeNft.deployed();
    const fakenftContractAddres = fakeNft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("5", "ether");

    // Should allow to list a new token
    await nft.createToken("https://axtrading.io/1", "{test:one}");
    await nft.createToken("https://axtrading.io/2", "{test:two}");

    await market.listMarketItem(nftContractAddres, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.listMarketItem(nftContractAddres, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    const beforePurchasedItems = await market.fetchMarketItems();

    expect(beforePurchasedItems.length).to.equal(2);

    // Should allow to make a purchase
    await market
      .connect(buyerAddress)
      .purchaseItem(nftContractAddres, 1, { value: auctionPrice });

    const items = await market.fetchMarketItems();

    expect(items.length).to.equal(1);

    // should Allow to resell a token
    const newPrice = ethers.utils.parseUnits("10", "ether");

    await nft.connect(buyerAddress).approve(marketAddress, 1);

    await market
      .connect(buyerAddress)
      .resellToken(nftContractAddres, 1, newPrice, {
        value: listingPrice,
      });

    const resellItems = await market.fetchMarketItems();

    const newPrice2 = ethers.utils.parseUnits("20", "ether");

    expect(resellItems.length).to.equal(2);
    expect(resellItems[0].price).to.equal(newPrice);

    // Should not allow to list a token from another contract
    await expect(
      market
        .connect(buyerAddress)
        .resellToken(fakenftContractAddres, 1, newPrice, {
          value: listingPrice,
        })
    ).to.be.revertedWith("Only item owner can perform this operation");

    const newResellItems = await market.fetchMarketItems();

    expect(newResellItems.length).to.equal(2);

    // allows to change price of a token
    await market
      .connect(buyerAddress)
      .changePrice(1, newPrice2);

    const newResellItemsChange = await market.fetchMarketItems();

    expect(newResellItemsChange.length).to.equal(2);
    expect(newResellItemsChange[0].price).to.equal(newPrice2);

    // allows to deList a token from the market
    await market
      .connect(buyerAddress)
      .delistNFT(nftContractAddres, 1);

    const updatedItems = await market.fetchMarketItems();

    expect(updatedItems.length).to.equal(1);
  });
});
