const hre = require("hardhat");
const axios = require("axios");
const nftContractAbi = require("../artifacts/contracts/NFT.sol/NFT.json").abi;
const nftMarketContractAbi =
  require("../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json").abi;
const _ = require("lodash");

const nftaddress = "0xad35155c6e88273c6b91b8b93933945847813051";
const nftmarketaddress = "0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536";

async function delist() {
  console.log("Importing NFTs...");

  const [signer] = await ethers.getSigners();
  console.log("signer", signer);
  console.log("nftmarketaddress", nftmarketaddress);
  console.log("nftaddress", nftaddress);
  console.log("signer", signer);
  const marketContract = new hre.ethers.Contract(
    nftmarketaddress,
    nftMarketContractAbi,
    signer
  );
  const tokenContract = new hre.ethers.Contract(
    nftaddress,
    nftContractAbi,
    signer
  );

  const allNfts = await marketContract.fetchMarketItems();

  console.log("allNfts", allNfts);
  const delistNfts = [];
  for (const nftId of delistNfts) {
    const compareValue = ethers.BigNumber.from(nftId.toString());

    //561, 562, 563, 564, 565, 566, 567
    const toDelist = _.filter(allNfts, (nft) => nft.tokenId.eq(compareValue));

    console.log("toDelist", toDelist);

    for (const nft of toDelist) {
      if (nft.owner == "0x0000000000000000000000000000000000000000") {
        continue;
      }

      console.log("token delisting", nft);
      let transactiondelist = await marketContract.delistNFT(nft.tokenId);
      console.log("token delisted", nft.tokenId);
      console.log("transation", transactiondelist);
    }
  }

  console.log("initialized market contracts");
}

delist()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
