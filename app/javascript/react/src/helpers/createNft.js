import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import Web3Modal from 'web3modal';
import { create as ipfsHttpClient } from "ipfs-http-client";

import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json';
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

import { nftaddress, nftmarketaddress } from '../config';
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic MkRnRGNzc0pHaGdxbEZKUUYzOHZ3U0RqRHBEOjQ0NGNhMWFjMTAwOWQxODljODU0ZGEyZmNhYmUwZGYy",
  },
});
//1. create item (image/video) and upload to ipfs
export async function createItem({ name, description, price, fileUrl, meta, teamName }) {
  //form validation
  if (!name || !description || !price || !fileUrl || !meta || !teamName) {
    return;
  }
  let parseJson = JSON.parse(meta);
  parseJson.cardBasicInfo.price = price;
  parseJson.name = name;
  parseJson.soccerPlayerInfo.playerName = name;
  parseJson.soccerPlayerInfo.playerStats.find((stat) =>
    stat.hasOwnProperty("image")
  ).image = fileUrl;


  const data = JSON.stringify({
    name,
    description,
    image: fileUrl,
    metaJson: parseJson,
  });


  const added = await client.add(data);
  const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;
  //pass the url to sav eit on Polygon adter it has been uploaded to IPFS
  await createSale(url, data);
  console.log(`Error uploading file: `, error);

}

//2. List item for sale
async function createSale(url, meta) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);

  //sign the transaction
  const signer = provider.getSigner();
  let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
  let transaction = await contract.createToken(url, meta);
  let tx = await transaction.wait();
  console.log(tx, "TX");
  //get the tokenId from the transaction that occured above
  //there events array that is returned, the first item from that event
  //is the event, third item is the token id.
  console.log("Transaction: ", tx);
  console.log("Transaction events: ", tx.events[0]);
  let event = tx.events[0];
  let value = event.args[2];
  let tokenId = value.toNumber(); //we need to convert it a number

  //get a reference to the price entered in the form
  const price = ethers.utils.parseUnits(price, "ether");

  contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  //get the listing price
  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();

  transaction = await contract.listMarketItem(nftaddress, tokenId, price, {
    value: listingPrice,
  });

  await transaction.wait();
  const navigate = useNavigate();

  navigate("/");
}
