const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {

  it("Should create a new Sale", async function () {
    const Market = await ethers.getContractFactory("NFTMarketplace")

    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddres = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('5', 'ether')

    await nft.createToken("https://axtrading.io/1", "{test:one}")
    await nft.createToken("https://axtrading.io/2", "{test:two}")

    await market.listMarketItem(nftContractAddres, 1, auctionPrice, { value: listingPrice })
    await market.listMarketItem(nftContractAddres, 2, auctionPrice, { value: listingPrice})

    const items2 = await market.fetchMarketItems()

    console.log(items2)
    expect(items2.length).to.equal(2)

    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).purchaseItem(nftContractAddres, 1, { value: auctionPrice })

    const items = await market.fetchMarketItems()

    expect(items.length).to.equal(1)
  });
})
