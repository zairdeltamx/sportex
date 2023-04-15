import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../config";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import NFT from "../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import { notification } from "../components/alerts/notifications";

export async function allowance({ setTransactionIsLoading, tokenId }) {
  setTransactionIsLoading(true);
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // Approve the NFT for sale
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    // const approve = await nftContract.approve(
    //   "0x0000000000000000000000000000000000000000",
    //   tokenId
    // );
    // await approve.wait();
    const allowance = await nftContract.getApproved(tokenId);
    console.log(allowance, "ALLOWANCE");
    if (allowance.toLowerCase() == nftmarketaddress) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    notification.showErrorWithButton({
      title: "Error",
      message: "An error has occurred, please try again",
    });
  } finally {
    setTransactionIsLoading(false);
  }
}
