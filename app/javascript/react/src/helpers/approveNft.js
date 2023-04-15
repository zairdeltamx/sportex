import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../config";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import NFT from "../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import { notification } from "../components/alerts/notifications";
import { allowance } from "./allowanceNft";
export async function approve({
  setnftIsApproval,
  setTransactionIsLoading,
  tokenId,
  address,
}) {
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

    const approveTx = await nftContract.approve(nftmarketaddress, tokenId);
    await approveTx.wait();

    notification.showSuccess({
      title: "success",
      message: "NFT has been approved for sale",
    });
    const requestAallowance = await allowance({
      setTransactionIsLoading,
      tokenId,
    });
    console.log("ALLOWANCE APPROVAL", requestAallowance);
    setnftIsApproval(requestAallowance);
  } catch (error) {
    console.log(error, "ERR");
    notification.showErrorWithButton({
      title: "Error",
      message: "Failed to approve nft",
    });
  } finally {
    setTransactionIsLoading(false);
  }
}
