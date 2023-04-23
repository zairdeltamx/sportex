const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;

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

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function processBatch(batch, tokenContract, marketContract) {
  // Your processing logic here.
  // For example: console.log(batch);
  await batchCreate(batch, tokenContract, marketContract);
}

async function processLargeArray(largeArray, tokenContract, marketContract, batchSize) {
  const batches = chunkArray(largeArray, batchSize);

  for (const batch of batches) {
    await processBatch(batch, tokenContract, marketContract);
  }
}

const downloadImage = async (url, imagePath) => {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
  });

  fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'), 'binary');
};

// Function to add the image to IPFS
const addToIPFS = async (imagePath) => {
  const file = fs.readFileSync(imagePath);
  const result = await client.add(file);

  const url = `https://sportex-staging.infura-ipfs.io/ipfs/${result.path}`;

  console.log('IPFS url:', url);

  return url;
};

const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();

const nftaddress = '0xad35155c6e88273c6b91b8b93933945847813051';
const nftmarketaddress = '0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536';

async function submitPlayertoBlockchain(parseJson, url) {
  const stringJson = JSON.stringify(parseJson);

  const [signer] = await ethers.getSigners();

  console.log('starting to create token...', parseJson.name);

  let contract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);
  let transaction = await contract.createToken(url, stringJson);
  let tx = await transaction.wait();
  console.log(tx, "TX");
  console.log("Transaction: ", tx);
  console.log("Transaction events: ", tx.events[0]);
  let event = tx.events[0];
  let value = event.args[2];
  let tokenId = value.toNumber(); //we need to convert it a number
  console.log("Token ID: ", tokenId);

  const price = ethers.utils.parseUnits('0.3', "ether");

  contract = new ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  transaction = await contract.listMarketItem(nftaddress, tokenId, price);
}

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

async function importPlayer(player) {
  let parseJson = JSON.parse(player.json);
  parseJson.price = 100;
  parseJson.name = 'Hidden';
  parseJson.PlayerName = 'Hidden';
  parseJson.playerName = 'Hidden';
  parseJson.description = 'Hidden';
  parseJson.teamName = player.equipo;
  parseJson.playerName = 'Hidden';
  parseJson.authentication_signature = xorEncode(player.nombre_jugador, 'sportex-sync');

  await downloadImage(player.imagen_oscurecida_url, 'image.gif');

  const imageipfs = await addToIPFS('image.gif');

  parseJson.image = imageipfs;

  const data = JSON.stringify({
    name: parseJson.name,
    description: parseJson.description,
    image: parseJson.image,
    metaJson: parseJson
  });

  const added = await client.add(data);
  const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;

  await submitPlayertoBlockchain(parseJson, url);

  return { url, parseJson };
};

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

  const [signer] = await ethers.getSigners();
  console.log("signer", signer);
  console.log('nftmarketaddress', nftmarketaddress);
  console.log('nftaddress', nftaddress);
  console.log('signer', signer);
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  console.log("initialized market contracts");

  const allNfts = await marketContract.fetchAllMarketItems();

  console.log("allNfts", allNfts);

  var results = Papa.parse(playersCsv, {
	  header: true
  });

  await comparison(allNfts, tokenContract, results);

  const playerTokensAndMetas = [];

  //for (const player of results.data) {
    //const nft = allNfts.find((nft) => nft.name === player.nombre_jugador);
    //if (!nft && player.nombre_jugador !== '') {
      //console.log("player", player);
      //try {
        //const match = await importPlayer(player, marketContract, tokenContract);
        //playerTokensAndMetas.push(match);
        //console.log("url", url);
      //} catch (error) {
        //console.log("error", error);
      //}
    //} else {
      //console.log(`NFT already exists: ${player.nombre_jugador}`);
    //}
  //}

  // await batchCreate(playerTokensAndMetas, tokenContract, marketContract);

  //const batchSize = 20;
  //await processLargeArray(playerTokensAndMetas, tokenContract, marketContract, batchSize);

  console.log("Done importing NFTs");
};

async function batchCreate(playerTokensAndMetas, tokenContract, marketContract) {
  console.log("playerTokensAndMetas", playerTokensAndMetas);
  const tokenUrls = playerTokensAndMetas.map((player) => player.url);
  const metas = playerTokensAndMetas.map((player) => JSON.stringify(player.parseJson));

  console.log("tokenUrls", tokenUrls);
  console.log("metas", metas);
  const GAS_LIMIT = 1000000;
  const batchCreateTransaction = await tokenContract.batchCreateTokens(tokenUrls, metas, { gasLimit: GAS_LIMIT });

  console.log('waiting for batchCreateTransaction...')
  let tx = await batchCreateTransaction.wait();
  console.log(tx, "TX");
  console.log("Transaction: ", tx);
  console.log("Transaction events: ", tx.events[0]);
  let event = tx.events[0];
  let value = event.args[2];

  console.log("values", value);
  console.log("values to number", value.map((v) => v.toNumber()));
  const prices = playerTokensAndMetas.map((_) => ethers.utils.parseUnits('100', 'ether'));

  const batchListTransaction = await marketContract.batchListMarketItems(
    nftaddress,
    value.map((v) => v.toNumber()),
    prices
  );
  await batchListTransaction.wait();
};

importNFTs().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
