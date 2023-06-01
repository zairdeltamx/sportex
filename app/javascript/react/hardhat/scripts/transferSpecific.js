const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;
const _ = require('lodash');
const fs = require('fs');
const Papa = require('papaparse');

const nftaddress = '0xad35155c6e88273c6b91b8b93933945847813051';
const nftmarketaddress = '0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536';

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


function fetchBnbPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';

  return axios.get(url).then((res) => {
    return parseFloat(res.data.binancecoin.usd);
  });
};

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

const downloadImage = async (url, imagePath) => {
  console.log('Downloading image from:', url);
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

async function submitPlayertoBlockchain(parseJson, url, bnbCost, owner) {
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

  const price = ethers.utils.parseUnits(bnbCost.toString(), "ether");

  const marketcontract = new ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  let listtransaction = await marketcontract.listMarketItem(nftaddress, tokenId, price);
  await listtransaction.wait();

  let delisttransact = await marketcontract.delistNFT(tokenId);
  await delisttransact.wait();

  let transactionapprove = await contract.approve(nftmarketaddress, tokenId);
  await transactionapprove.wait();

  let transferTotransaction = await marketcontract.transferTo(owner, tokenId);
  await transferTotransaction.wait();
}

async function importPlayer(player, bnbPrice, owner, batch_number) {
  let parseJson = JSON.parse(player.json);
  parseJson.price = player.price;
  parseJson.name = player.nombre_jugador;
  parseJson.PlayerName = player.nombre_jugador;
  parseJson.playerName = player.nombre_jugador;
  parseJson.description = player.equipo;
  parseJson.teamName = player.equipo;
  parseJson.playerName = player.nombre_jugador;
  parseJson.authentication_signature = xorEncode(player.nombre_jugador, 'sportex-sync');
  parseJson.player_batch_number = batch_number;

  let bnbCost = parseFloat(player.price) / bnbPrice;
  let roundedBnbCost = Math.round(bnbCost * 10) / 10

  console.log('bnbCost', roundedBnbCost);

  await downloadImage(player.imagen_url, 'image.gif');
  console.log('image downloaded');

  const imageipfs = await addToIPFS('image.gif');
  console.log('image added to ipfs');

  parseJson.image = imageipfs;

  const data = JSON.stringify({
    name: parseJson.name,
    description: parseJson.description,
    image: parseJson.image,
    metaJson: parseJson
  });

  const added = await client.add(data);
  const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;

  await submitPlayertoBlockchain(parseJson, url, roundedBnbCost, owner);

  return { url, parseJson };
};

async function nftMetaMatcher(tokenContract, nfts) {
  const newNfts = [];

  for (const nft of nfts) {
    if (nft.owner == '0x0000000000000000000000000000000000000000') {
      continue;
    }

    const jsonString = await tokenContract.getNFTmeta(nft.tokenId);
    var metaJson = JSON.parse(jsonString);

    const playerName = xorEncode(metaJson.authentication_signature, 'sportex-sync');

    newNfts.push({
      id: nft.tokenId,
      playerName: playerName,
      batch_number: metaJson.player_batch_number,
      owner: nft.owner
    });
  }

  return newNfts;
}

async function delist() {
  console.log("Importing NFTs...");

  const [signer] = await ethers.getSigners();
  console.log("signer", signer);
  console.log('nftmarketaddress', nftmarketaddress);
  console.log('nftaddress', nftaddress);
  console.log('signer', signer);
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  const allNfts = await marketContract.fetchAllMarketItems();

  const presale = _.filter(allNfts, (nft) => nft.presale === true);
  const nonpresale = _.filter(allNfts, (nft) => nft.presale === false);
  const soldNfts = _.filter(presale, (nft) => nft.sold)

  console.log('all nfts', _.takeRight(allNfts, 3));

  const metamatcher = await nftMetaMatcher(tokenContract, nonpresale);

  console.log('metamatcher', metamatcher);
  console.log('metamatch length', metamatcher.length);

  const playersCsv = fs.readFileSync('./players.csv').toString();

  var results = Papa.parse(playersCsv, {
	  header: true
  });

  var bnbPrice = await fetchBnbPrice();

  for (const nft of soldNfts) {
    if (nft.owner == '0x0000000000000000000000000000000000000000') {
      continue;
    }

    const jsonString = await tokenContract.getNFTmeta(nft.tokenId);
    var metaJson = JSON.parse(jsonString);

    const playerName = xorEncode(metaJson.authentication_signature, 'sportex-sync');

    const jugador = results.data.find((nft) => nft.nombre_jugador == playerName);

    const batchNumber = metaJson.player_batch_number || 1;

    const match = _.find(metamatcher, (metanft) =>
      metanft.playerName == playerName &&
      metanft.owner == nft.owner &&
      metanft.batch_number == batchNumber + 1
    )

    console.log('jugador Row', jugador);
    console.log('name', playerName);
    console.log('batch number', batchNumber);
    console.log('owner', nft.owner);
    console.log('seller', nft.seller);
    console.log('sold', nft.sold);
    console.log('match', match);

    if (!match) {
      console.log('starting to transfer...')
      console.log('batchNumber', batchNumber + 1);
      await importPlayer(jugador, bnbPrice, nft.owner, batchNumber + 1)
    } else {
      console.log('already created!');
    }

  }

  console.log("initialized market contracts");
}

delist().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
