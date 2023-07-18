const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;
const _ = require('lodash');

const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();
const assignationNftsCsv = fs.readFileSync('./nft-allocations.csv').toString();

const nftaddress = '0xad35155c6e88273c6b91b8b93933945847813051';
const nftmarketaddress = '0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536';

function xorEncode(input, key) {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const inputCharCode = input.charCodeAt(i);
    const keyCharCode = key.charCodeAt(i % key.length);
    const xorCharCode = inputCharCode ^ keyCharCode;
    output += String.fromCharCode(xorCharCode);
  }
  return output;
}

function fetchBnbPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';

  return axios.get(url).then((res) => {
    return parseFloat(res.data.binancecoin.usd);
  });
};

async function updateNftsPrice() {
  console.log("Importing NFTs...");

  const [signer] = await ethers.getSigners();
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  console.log("initialized market contracts");

  console.log("assignationNftsCsv", assignationNftsCsv);
  var addresses_to_transfer = Papa.parse(assignationNftsCsv, {
	  header: true
  });


  const allNfts = await marketContract.fetchMarketItems();
  const allNftsFilteredBy = _.filter(allNfts, (nft) => nft.seller === '0x85F6958a2b373a503A4fEDA6f48ab60e1B6d0D28');

  console.log("allNfts", allNftsFilteredBy);

  var results = Papa.parse(playersCsv, {
	  header: true
  });

  var bnbPrice = await fetchBnbPrice();

  console.log("nfts", allNfts.length);

  var bronce_nfts = [];

  for (const nft of allNftsFilteredBy) {
    if (nft.owner != "0x0000000000000000000000000000000000000000") {

      var jsonString = await tokenContract.getNFTmeta(nft.tokenId);
      var metaJson = JSON.parse(jsonString);

      if (metaJson.range == "Bronce") {
        console.log("ID", nft.tokenId);
        console.log("Seller", nft.seller);
        console.log("Owner", nft.owner);
        console.log("Bronce", metaJson.image);
        bronce_nfts.push(nft);
      }
    }
  }

  console.log("bronce_nfts", bronce_nfts.length);

  for (const assignation of addresses_to_transfer.data) {
    const address_to_transfer_to = assignation.WALLET;
    const nftsToTransfer = _.take(bronce_nfts, parseInt(assignation.NFT));

    console.log('address_to_transfer_to', address_to_transfer_to);
    console.log('nftsToTransfer', assignation.NFT);

    for (const nft of nftsToTransfer) {
      console.log('token delisting', nft.tokenId);
      let transactiondelist = await marketContract.delistNFT(nft.tokenId);
      await transactiondelist.wait();
      console.log('token delisted', nft.tokenId);
      console.log('token approving', nft.tokenId);
      let transactionapprove = await tokenContract.approve(nftmarketaddress, nft.tokenId);
      await transactionapprove.wait();
      console.log('token approved', nft.tokenId);
      console.log('token transfering', nft.tokenId);
      let transferTotransaction = await marketContract.transferTo(address_to_transfer_to, nft.tokenId);
      await transferTotransaction.wait();
      console.log('token transfered', nft.tokenId);
      console.log('transation', transferTotransaction);
    }

    bronce_nfts = _.drop(bronce_nfts, parseInt(assignation.NFT));
    console.log("moving to next nfts INT");
  }


  console.log("Done updating NFTs");
};

updateNftsPrice().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
