const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;

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

function diffArray(arr1, arr2) {
  const result = [];

  arr1.forEach(item => {
    if (arr2.indexOf(item) === -1) {
      result.push(item);
    }
  });

  arr2.forEach(item => {
    if (arr1.indexOf(item) === -1) {
      result.push(item);
    }
  });

  return result;
}

async function batchTransfer(allNfts, tokenContract, results) {
}

async function importNFTs() {
  console.log("Importing NFTs...");
  console.log("data", nftMarketContractAbi);
  console.log('nftContractAbi', nftContractAbi);

  const [signer] = await ethers.getSigners();
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  const allNfts = await marketContract.fetchAllMarketItems();

  //console.log("allNfts", allNfts);

  var results = Papa.parse(playersCsv, {
	  header: true
  });

  await batchTransfer(allNfts, tokenContract, results);

  console.log("Done importing NFTs");
};

importNFTs().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
