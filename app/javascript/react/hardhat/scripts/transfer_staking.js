const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;
const _ = require('lodash');

const Papa = require('papaparse');
const fs = require('fs');
const playersCsv = fs.readFileSync('./players.csv').toString();
const assignationNftsCsv = fs.readFileSync('./stacking-july29.csv').toString();

const nftaddress = '0xad35155c6e88273c6b91b8b93933945847813051';
const nftmarketaddress = '0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536';

const range_nfts_map = {
  "BASIC": [],
  "PRO": [{
    "Bronce": 1,
  }],
  "EXPERT": [{
    "Bronce": 2,
  }],
  "INVESTOR": [{
    "Bronce": 1,
  }, {
    "Silver": 2,
  }],
  "VIP": [{
    "Bronce": 1,
  }, {
    "Silver": 2,
  }, {
    "Golden": 2,
  }, {
    "Legend": 1,
  }]
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
  var silver_nfts = [];
  var gold_nfts = [];
  var legend_nfts = [];
  var epic_nfts = [];

  for (const nft of allNftsFilteredBy) {
    if (nft.owner != "0x0000000000000000000000000000000000000000") {

      var jsonString = await tokenContract.getNFTmeta(nft.tokenId);
      var metaJson = JSON.parse(jsonString);

      if (metaJson.range == "Bronce") {
        console.log("ID", nft.tokenId);
        console.log("Range", metaJson.range);
        bronce_nfts.push(nft);
      }

      if (metaJson.range == "Silver") {
        console.log("ID", nft.tokenId);
        console.log("Range", metaJson.range);
        silver_nfts.push(nft);
      }

      if (metaJson.range == "Golden") {
        console.log("ID", nft.tokenId);
        console.log("Range", metaJson.range);
        gold_nfts.push(nft);
      }

      if (metaJson.range == "Legend") {
        console.log("ID", nft.tokenId);
        console.log("Range", metaJson.range);
        legend_nfts.push(nft);
      }

      if (metaJson.range == "Epic") {
        console.log("ID", nft.tokenId);
        console.log("Range", metaJson.range);
        epic_nfts.push(nft);
      }
    }
  }

  console.log("bronce_nfts", bronce_nfts.length);
  console.log("silver_nfts", silver_nfts.length);
  console.log("gold_nfts", gold_nfts.length);
  console.log("legend_nfts", legend_nfts.length);
  console.log("epic_nfts", epic_nfts.length);

  const filter_out_empty_names = _.filter(addresses_to_transfer.data, (nft) => nft.name != '');
  const filter_out_empty_ax_dao_wallet = _.filter(filter_out_empty_names, (nft) => nft.ax_dao_wallet != 'NULL');

  console.log("with wallet assigned", filter_out_empty_ax_dao_wallet);

  for (const assignation of filter_out_empty_ax_dao_wallet) {
    const address_to_transfer_to = assignation.ax_dao_wallet;

    const allocations = range_nfts_map[assignation.name];

    console.log("address_to_transfer_to", address_to_transfer_to);
    console.log("allocations", allocations);

    for (const allocation of allocations) {
      const range = Object.keys(allocation)[0];
      const amount = allocation[range];

      var nftsToTransfer = [];

      console.log("range", range);
      console.log("amount", amount);

      if (range == "Bronce") {
        nftsToTransfer = _.take(bronce_nfts, amount);
      }

      if (range == "Silver") {
        nftsToTransfer = _.take(silver_nfts, amount);
      }

      if (range == "Golden") {
        nftsToTransfer = _.take(gold_nfts, amount);
      }

      if (range == "Legend") {
        nftsToTransfer = _.take(legend_nfts, amount);
      }

      if (range == "Epic") {
        nftsToTransfer = _.take(epic_nfts, amount);
      }

      for (const nft of nftsToTransfer) {
        var jsonString = await tokenContract.getNFTmeta(nft.tokenId);
        var metaJson = JSON.parse(jsonString);
        console.log("token range transferred", metaJson.range);
        console.log('token delisting', nft.tokenId);
        let transactiondelist = await marketContract.delistNFT(nft.tokenId);
        await transactiondelist.wait();
        console.log('token delisted', nft.tokenId);
        console.log('token approving', nft.tokenId);
        let transactionapprove = await tokenContract.approve(nftmarketaddress, nft.tokenId);
        await transactionapprove.wait();
        console.log('token approved', nft.tokenId);
        console.log('token transfering', nft.tokenId);
        let transferTotransaction = await marketContract.transferTo(assignation.ax_dao_wallet, nft.tokenId);
        await transferTotransaction.wait();
        console.log('token transfered', nft.tokenId);
        console.log('transation', transferTotransaction);
      }

      if (range == "Bronce") {
        bronce_nfts = _.drop(bronce_nfts, amount);
      }

      if (range == "Silver") {
        silver_nfts = _.drop(silver_nfts, amount);
      }

      if (range == "Golden") {
        gold_nfts = _.drop(gold_nfts, amount);
      }

      if (range == "Legend") {
        legend_nfts = _.drop(legend_nfts, amount);
      }

      if (range == "Epic") {
        epic_nfts = _.drop(epic_nfts, amount);
      }
    }

    console.log("bronce_nfts left", bronce_nfts.length);
    console.log("silver_nfts left", silver_nfts.length);
    console.log("gold_nfts left", gold_nfts.length);
    console.log("legend_nfts left", legend_nfts.length);
    console.log("epic_nfts left", epic_nfts.length);


    //const nftsToTransfer = _.take(bronce_nfts, amount_to_transfer);

    //console.log('address_to_transfer_to', address_to_transfer_to);

    //for (const nft of nftsToTransfer) {
      //console.log('token to transfer', nft);
      //console.log('token delisting', nft.tokenId);
      //let transactiondelist = await marketContract.delistNFT(nft.tokenId);
      //await transactiondelist.wait();
      //console.log('token delisted', nft.tokenId);
      //console.log('token approving', nft.tokenId);
      //let transactionapprove = await tokenContract.approve(nftmarketaddress, nft.tokenId);
      //await transactionapprove.wait();
      //console.log('token approved', nft.tokenId);
      //console.log('token transfering', nft.tokenId);
      //let transferTotransaction = await marketContract.transferTo(address_to_transfer_to, nft.tokenId);
      //await transferTotransaction.wait();
      //console.log('token transfered', nft.tokenId);
      //console.log('transation', transferTotransaction);
    //}

    //bronce_nfts = _.drop(bronce_nfts, amount_to_transfer);
  }


  console.log("Done updating NFTs");
};

updateNftsPrice().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
