import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../config";
import { deleteNft } from "../services/nft";
import { notification } from "../components/alerts/notifications";

export default async function buyNFT(nft) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  // sign the transaction
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  // set the price
  const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

  // make the sale
  const transaction = await contract.purchaseItem(nftaddress, nft.tokenId, {
    value: price,
  });
  await transaction.wait();
}
