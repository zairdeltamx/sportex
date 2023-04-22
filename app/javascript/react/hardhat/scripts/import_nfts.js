const hre = require("hardhat");
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


const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();

const nftaddress = '0x29f0dd0d44eb846ab8bbe245e35657fe5c88c0e2';
const nftmarketaddress = '0x02bdbc6c01ba7f2565b1bf9a67e503aa72f4a83b';

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

  const price = ethers.utils.parseUnits('100', "ether");

  contract = new ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  transaction = await contract.listMarketItem(nftaddress, tokenId, price);
}

async function importPlayer(player) {
  let parseJson = JSON.parse(player.json);
  parseJson.price = 100;
  parseJson.name = 'Hidden';
  parseJson.description = 'Hidden';
  parseJson.teamName = player.equipo;
  parseJson.playerName = 'Hidden';
  parseJson.image = player.imagen_oscurecida_url;

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

  const resultados = results.data.map((player) => player.nombre_jugador);
  console.log("resultados", resultados);

  const playerTokensAndMetas = [];

  for (const player of results.data) {
    const nft = allNfts.find((nft) => nft.name === player.nombre_jugador);
    if (!nft && player.nombre_jugador !== '') {
      console.log("player", player);
      try {
        const match = await importPlayer(player, marketContract, tokenContract);
        playerTokensAndMetas.push(match);
        //console.log("url", url);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      console.log(`NFT already exists: ${player.nombre_jugador}`);
    }
  }

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
