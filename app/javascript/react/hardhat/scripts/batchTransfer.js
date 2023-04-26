const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;
const _ = require('lodash');

const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();

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

async function batchTransfer(allNfts, marketContract, tokenContract) {
  let nftsSorter = allNfts.slice().sort((a, b) => {
    const aValue = Number(a.tokenId.toString());
    const bValue = Number(b.tokenId.toString());
    return aValue - bValue;
  });

  const transferToAddres = '0x618b938269920d17f0dce82e5db931d2a96f07e4';

  const nftsToTransfer = _.take(nftsSorter, 5);

  console.log("nftsToTransfer", nftsToTransfer);

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
    let transferTotransaction = await marketContract.transferTo('0x293657d0C9F6c79E9a597F006610332181F9e9fa', nft.tokenId);
    await transferTotransaction.wait();
    console.log('token transfered', nft.tokenId);
    console.log('transation', transferTotransaction);
  }
}

async function importNFTs() {
  console.log("Importing NFTs...");
  const [signer] = await ethers.getSigners();
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  const allNfts = await marketContract.fetchMarketItems();

  console.log("allNfts", allNfts);
  //const allNftsFilteredBy = _.filter(allNfts, (nft) => nft.seller === '0x85F6958a2b373a503A4fEDA6f48ab60e1B6d0D28');

  //console.log("allNfts", allNfts);

  var results = Papa.parse(playersCsv, {
	  header: true
  });

  //await batchTransfer(allNftsFilteredBy, marketContract, tokenContract);

  console.log("Done importing NFTs");
};

importNFTs().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
