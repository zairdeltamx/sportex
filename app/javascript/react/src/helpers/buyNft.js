import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftmarketaddress } from "../config";
import { deleteNft } from "../services/nft";

async function buyNFT(nft) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  // sign the transaction
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  // set the price
  const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

  // make the sale
  const transaction = await contract.purchaseItem(nft.tokenId, {
    value: price,
  });
  await transaction.wait();
}

export default async function handleBuyNft({nft,setTransactionIsLoading}) {
  try {
    setTransactionIsLoading(true);
    await buyNFT(nft);
    await deleteNft({ id: nft.id });
    setTransactionIsLoading(false);

    notification.showSuccess({
      title: "Successful purchase",
      message: "Your NFT will be found in the My Assets section",
    });
  } catch (error) {
    setTransactionIsLoading(false);
    if (error.code === CODE_INSUFFICIENT_GAS) {
      notification.showWarning({
        title: "Failed to buy",
        message: "You don't have enough gas for this purchase",
      });
      return;
    }
    notification.showError({
      title: "Failed to buy",
      message: "An error has occurred in the purchase, please try again",
    });
  } finally {
    setTransactionIsLoading(false);
  }
}