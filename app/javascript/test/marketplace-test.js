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

    await market.createMarketItem(nftContractAddres, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddres, 2, auctionPrice, { value: listingPrice})

    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftContractAddres, 1, { value: auctionPrice })

    const items = await market.fetchMarketItems()

    console.log('items ', items)
  });
})
