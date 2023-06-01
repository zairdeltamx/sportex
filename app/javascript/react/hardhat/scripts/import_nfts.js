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

const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();

const nftaddress = '0xad35155c6e88273c6b91b8b93933945847813051';
const nftmarketaddress = '0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536';

async function submitPlayertoBlockchain(parseJson, url, bnbCost) {
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

function fetchBnbPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';

  return axios.get(url).then((res) => {
    return parseFloat(res.data.binancecoin.usd);
  });
};

async function importPlayer(player, bnbPrice) {
  let parseJson = JSON.parse(player.json);
  parseJson.price = player.price;
  parseJson.name = player.nombre_jugador;
  parseJson.PlayerName = player.nombre_jugador;
  parseJson.playerName = player.nombre_jugador;
  parseJson.description = player.equipo;
  parseJson.teamName = player.equipo;
  parseJson.playerName = player.nombre_jugador;
  parseJson.authentication_signature = xorEncode(player.nombre_jugador, 'sportex-sync');
  parseJson.player_batch_number = 1;

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

  await submitPlayertoBlockchain(parseJson, url, roundedBnbCost);

  return { url, parseJson };
};

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

  var bnbPrice = await fetchBnbPrice();

  console.log("bnbPrice", bnbPrice);

  for (const player of results.data) {
    const nft = allNfts.find((nft) => nft.name === player.nombre_jugador);
    if (!nft && player.nombre_jugador !== '') {
      console.log("player", player);
      try {
        const match = await importPlayer(player, bnbPrice);
        console.log("url", match.url);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      console.log(`NFT already exists: ${player.nombre_jugador}`);
    }
  }

  console.log("Done importing NFTs");
};

importNFTs().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
