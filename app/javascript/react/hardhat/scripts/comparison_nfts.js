const hre = require("hardhat");
const axios = require("axios");
const nftContractAbi = require("../artifacts/contracts/NFT.sol/NFT.json").abi;
const nftMarketContractAbi =
  require("../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json").abi;

const Papa = require("papaparse");
const fs = require("fs");
const playersCsv = fs.readFileSync("./players.csv").toString();

const nftaddress = "0xad35155c6e88273c6b91b8b93933945847813051";
const nftmarketaddress = "0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536";

function xorEncode(input, key) {
  let output = "";
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

  arr1.forEach((item) => {
    if (arr2.indexOf(item) === -1) {
      result.push(item);
    }
  });

  arr2.forEach((item) => {
    if (arr1.indexOf(item) === -1) {
      result.push(item);
    }
  });

  return result;
}

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
    console.log(
      "owner be like: ",
      nft.owner == "0x0000000000000000000000000000000000000000"
    );

    if (nft.owner == "0x0000000000000000000000000000000000000000") {
      continue;
    }

    var metaJson = JSON.parse(jsonString);


    if (metaJson.player_batch_number == 15 && nft.presale == false) {
      const name = xorEncode(metaJson.authentication_signature, 'sportex-sync');
      console.log("found:", name);
      names.push(name);
    }
  }

  console.log(names, "names");
  console.log(names.length, "names.length");

  const resultados = results.data.map((player) => player.nombre_jugador);

  console.log("resultados", resultados);
  console.log("resultados.length", resultados.length);

  console.log("diff that is missing", diffArray(names, resultados));
  console.log("diff that is missing", diffArray(names, resultados).length);

  console.log("diff that is present", names);
  console.log("diff that is present", names.length);
}

async function importNFTs() {
  console.log("Importing NFTs...");
  console.log("data", nftMarketContractAbi);
  console.log("nftContractAbi", nftContractAbi);

  const [signer] = await ethers.getSigners();
  const marketContract = new hre.ethers.Contract(
    nftmarketaddress,
    nftMarketContractAbi,
    signer
  );
  const tokenContract = new hre.ethers.Contract(
    nftaddress,
    nftContractAbi,
    signer
  );

  const allNfts = await marketContract.fetchMarketItems();

  //console.log("allNfts", allNfts);

  var results = Papa.parse(playersCsv, {
    header: true,
  });

  await comparison(allNfts, tokenContract, results);

  console.log("Done importing NFTs");
}

importNFTs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
