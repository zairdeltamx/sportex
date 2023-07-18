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

function fetchBnbPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';

  return axios.get(url).then((res) => {
    return parseFloat(res.data.binancecoin.usd);
  });
};

async function updateNftsPrice() {
  console.log("Importing NFTs...");

  const [signer] = await ethers.getSigners();
  console.log("signer", signer);
  console.log('nftmarketaddress', nftmarketaddress);
  console.log('nftaddress', nftaddress);
  console.log('signer', signer);
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);
  const tokenContract = new hre.ethers.Contract(nftaddress, nftContractAbi, signer);

  console.log("initialized market contracts");

  const allNfts = await marketContract.fetchMarketItems();
  const allNftsFilteredBy = _.filter(allNfts, (nft) => nft.seller === '0x85F6958a2b373a503A4fEDA6f48ab60e1B6d0D28');

  console.log("allNfts", allNftsFilteredBy);

  var results = Papa.parse(playersCsv, {
	  header: true
  });

  var bnbPrice = await fetchBnbPrice();

  console.log("nfts", allNfts.length);

  var nfts_count = 0;

  for (const nft of allNftsFilteredBy) {
    if (nft.owner != "0x0000000000000000000000000000000000000000") {
      console.log("nft", nft.tokenId);
      console.log("nft", nft.owner);

      nfts_count += 1;

      var jsonString = await tokenContract.getNFTmeta(nft.tokenId);
      var metaJson = JSON.parse(jsonString);
      console.log("previous metaJson", metaJson);
      var playerName = xorEncode(metaJson.authentication_signature, 'sportex-sync');

      player_nft  = results.data.find(player => {
        return player.nombre_jugador == playerName;
      });

      console.log("playerName", playerName);

      metaJson.price = player_nft.price;
      metaJson.grade = player_nft.grade;
      metaJson.range = player_nft.type;
      metaJson.value = player_nft.value;

      if (metaJson.PlayerName == "Hidden") {
        console.log("Ignored player");
      } else {
        let bnbCost = parseFloat(player_nft.price) / bnbPrice;
        let roundedBnbCost = Math.round(bnbCost * 10) / 10
        const price = ethers.utils.parseUnits(roundedBnbCost.toString(), "ether");

        console.log("updating price...");
        console.log("price", price);
        let transaction = await marketContract.changePrice(nft.tokenId, price);
        let tx = await transaction.wait();

        console.log(tx, "TX");
        console.log("Transaction: ", tx);
        console.log("Transaction events: ", tx.events[0]);
      }
    }
  }

  console.log("nfts_count", nfts_count);

  console.log("Done updating NFTs");
};

updateNftsPrice().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
