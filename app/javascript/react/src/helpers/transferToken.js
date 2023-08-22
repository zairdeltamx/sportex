import { notification } from "../components/alerts/notifications";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

import { nftmarketaddress } from "../config";
import Web3 from "web3";
export async function transferToken({ nft, transferAddress }) {
  try {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const contract = new web3.eth.Contract(Market.abi, nftmarketaddress);

    console.log("TOKENID", nft.tokenId);
    console.log("ADDRESS", transferAddress);
    const transaction = await contract.methods
      .transferTo(transferAddress, nft.tokenId)
      .send({ from: accounts[0] });

    await transaction.wait();
    notification.showSuccess({
      title: "Success",
      message: "The NFT will transfer in a few minutes",
    });
    window.location.replace("/");
  } catch (error) {
    console.log(error);
    notification.showSuccess({
      title: "Error",
      message: "Failed to transfer NFT, please try again",
    });
  }
}
