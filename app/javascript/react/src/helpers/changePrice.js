import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftmarketaddress } from "../config";

export default async function changePrice(nft, price) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const priceFormatted = ethers.utils.parseEther(price);
  // sign the transaction
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  console.log("contract", contract);
  console.log("nft.tokenId", nft.tokenId);
  console.log("priceFormatted", priceFormatted);
  // make the sale
  const transaction = await contract.changePrice(nft.tokenId, priceFormatted);
  await transaction.wait();
}
