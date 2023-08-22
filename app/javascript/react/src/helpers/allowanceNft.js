import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../config";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import NFT from "../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import { notification } from "../components/alerts/notifications";

export async function allowance({ tokenId }) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    // const approve = await nftContract.approve(
    //   "0x0000000000000000000000000000000000000000",
    //   tokenId
    // );
    // await approve.wait();
    const allowance = await nftContract.getApproved(tokenId);
    console.log(allowance.toLowerCase(), "ALLOWANCE");
    console.log(nftmarketaddress, "NFTMARKET");

    if (allowance.toLowerCase() === nftmarketaddress.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    notification.showErrorWithButton({
      title: "Error",
      message: "An error has occurred, please try againn",
    });
    return false;
  }
}
