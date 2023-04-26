const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;
const { from, catchError, tap, map, filter, lastValueFrom, mergeMap } = require('rxjs');

const { create } = require('ipfs-http-client');

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic MkRnRGNzc0pHaGdxbEZKUUYzOHZ3U0RqRHBEOjQ0NGNhMWFjMTAwOWQxODljODU0ZGEyZmNhYmUwZGYy",
  },
});

const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();

const nftaddress = '0x552820268831298c5d4cfac7f9c1c9c7d4e0fb77';
const nftmarketaddress = '0xb17b495c3c1c7bd069956ab8b1b1bae57d9c2cdc';

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

async function comparison(allNfts, tokenContract, results) {
  const names = [];
  for (const nft of allNfts) {
    const jsonString = await tokenContract.getNFTmeta(nft.tokenId);
    var metaJson = JSON.parse(jsonString);
    names.push(xorEncode(metaJson.authentication_signature, 'sportex-sync'));
  }

  console.log(names, "names");
  console.log(names.length, "names.length");

  const resultados = results.data.map((player) => player.nombre_jugador);

  console.log("resultados", resultados);
  console.log('resultados.length', resultados.length);

  console.log('diff', diffArray(names, resultados));

}

async function importNFTs() {
  console.log("Importing NFTs...");
  console.log("data", nftMarketContractAbi);
  console.log('nftContractAbi', nftContractAbi);

  const [signer] = await ethers.getSigners();
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  const allNfts = await marketContract.fetchAllMarketItems();

  console.log("allNfts", allNfts);

  var results = Papa.parse(playersCsv, {
	  header: true
  });

  await comparison(allNfts, tokenContract, results);

  console.log("Done importing NFTs");
};

importNFTs().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
