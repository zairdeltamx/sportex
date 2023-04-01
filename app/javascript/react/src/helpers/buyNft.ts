import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../config";

export default async function buyNFT(nft:any) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  // sign the transaction
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  // set the price
  console.log("1");
  const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
  console.log("2");
  // make the sale
  console.log(price, "PRICE");
  const transaction = await contract.purchaseItem(nftaddress, nft.tokenId, {
    value: price,
  });
  console.log("3");
  await transaction.wait();
}
