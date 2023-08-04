const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;

const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();

const nftaddress = '0xad35155c6e88273c6b91b8b93933945847813051';
const nftmarketaddress = '0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536';

const { create } = require('ipfs-http-client');

const batch_number_dealing = 14;

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic MkRnRGNzc0pHaGdxbEZKUUYzOHZ3U0RqRHBEOjQ0NGNhMWFjMTAwOWQxODljODU0ZGEyZmNhYmUwZGYy",
  },
});

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
  parseJson.player_batch_number = batch_number_dealing;

  parseJson.PlayerName = player.nombre_jugador.replace("\"", "") ;
  parseJson.name = player.nombre_jugador.replace("\"", "") ;
  parseJson.playerName = player.nombre_jugador.replace("\"", "") ;
  parseJson.price = player.price;
  parseJson.grade = player.grade;
  parseJson.range = player.type;
  parseJson.value = player.value;

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

function fetchBnbPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';

  return axios.get(url).then((res) => {
    return parseFloat(res.data.binancecoin.usd);
  });
};



async function comparison(allNfts, tokenContract, results) {
  const names = [];

  let nftsSorter = allNfts.slice().sort((a, b) => {
    const aValue = Number(a.tokenId.toString());
    const bValue = Number(b.tokenId.toString());
    return aValue - bValue;
  });

  console.log("nftsSorter", nftsSorter);

  for (const nft of allNfts) {
    console.log("nft", nft);
    console.log("nft tokenId", nft.tokenId);
    const jsonString = await tokenContract.getNFTmeta(nft.tokenId);
    console.log("jsonString", jsonString);
    console.log("owner be like: ", nft.owner == '0x0000000000000000000000000000000000000000');

    if (nft.owner == '0x0000000000000000000000000000000000000000') {
      continue;
    }

    var metaJson = JSON.parse(jsonString);

    if (metaJson.player_batch_number == batch_number_dealing && nft.presale == false) {
      const name = xorEncode(metaJson.authentication_signature, 'sportex-sync');
      console.log("found:", name);
      names.push(name);
    }
  }

  console.log(names, "names");
  console.log(names.length, "names.length");

  const resultados = results.data.map((player) => player.nombre_jugador);

  console.log("resultados", resultados);
  console.log('resultados.length', resultados.length);

  console.log('diff that is missing', diffArray(names, resultados));
  console.log('diff that is missing', diffArray(names, resultados).length);

  console.log('diff that is present', names);
  console.log('diff that is present', names.length);

  var resultados_filter_by_diff = results.data.filter(function (n) {
    return diffArray(names, resultados).includes(n.nombre_jugador);
  });

  console.log('resultados_filter_by_diff', resultados_filter_by_diff.length);

  var bnbPrice = await fetchBnbPrice();

  console.log("bnbPrice", bnbPrice);

  for (const player of resultados_filter_by_diff) {
    console.log("player", player);
    if (player.nombre_jugador !== '') {
      try {
        const match = await importPlayer(player, bnbPrice);
        console.log("url", match.url);
      } catch (error) {
        console.log("error", error);
      }
    }
  }
}

async function importNFTs() {
  console.log("Importing NFTs...");
  console.log("data", nftMarketContractAbi);
  console.log('nftContractAbi', nftContractAbi);

  console.log("fetching signers");
  const [signer] = await ethers.getSigners();

  console.log("Initializing contracts...");
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  console.log("fetching market items");

  const allNfts = await marketContract.fetchMarketItems();

  console.log("fetched market items");

  //console.log("allNfts", allNfts);

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
