const hre = require("hardhat");
const axios = require('axios');
const nftContractAbi = require('../artifacts/contracts/NFT.sol/NFT.json').abi;
const nftMarketContractAbi = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;

const nftaddress = '0xad35155c6e88273c6b91b8b93933945847813051';
const nftmarketaddress = '0xe226b8ebfb4e329a9f3121b04e31b5f20de3c536';


async function disablePresale() {
  console.log("Importing NFTs...");

  const [signer] = await ethers.getSigners();
  console.log("signer", signer);
  console.log('nftmarketaddress', nftmarketaddress);
  console.log('nftaddress', nftaddress);
  console.log('signer', signer);
  const marketContract = new hre.ethers.Contract(nftmarketaddress, nftMarketContractAbi, signer);

  console.log("initialized market contracts");

  transaction = await marketContract.increaseItemIds();

  console.log('increase item ids');
  console.log('transaction', transaction);
}

disablePresale().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
