import React from "react";

import { ButtonBuyNft } from "../../../components/buttonBuyNft/ButtonBuyNft";
// Contracts and web3 libraries
import buyNFT from "../../../helpers/buyNft";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../../../config";

import { Link } from "react-router-dom";
import { notification } from "../../../components/alerts/notifications";
import { deleteNft } from "../../../services/nft";
import "./styles.css";
export const NftItem = ({ nft }) => {
  console.log(nft);
  const isAutorized = true;
  async function handleBuyNft(nft) {
    try {
      await buyNFT(nft);
      await deleteNft({ id: nft.id });
      notification.showSuccess({
        title: "Successful purchase",
        message: "Your NFT will be found in the My Assets section",
      });
      handleSubmit();
    } catch (error) {
      notification.showError({
        title: "Failed to buy",
        message: "An error has occurred in the purchase, please try again",
      });
    }
  }
  async function deListNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    console.log(nftaddress, "NFTADDRESS");
    console.log(nft, "TOKENID");
    const transaction = await contract.delistNFT(nftaddress, nft.tokenId, {
      value: listingPrice,
    });
    console.log("aqui");
    await transaction.wait();
  }

  return (
    <div>
      <div className="containerCard">
        <div className="containerImageCard">
          <Link to={`nftdetail/${nft.id}`}>
            <img src={nft.image} alt="" />
          </Link>
        </div>
        <div className="containerName">
          <h1>{nft.name}</h1>
          <p>Soccer player</p>
        </div>
        <hr />
        <div className="containerPriceCard">
          <p>Current Price</p>
          <p>{nft.price}</p>
        </div>
        <ButtonBuyNft nft={nft}></ButtonBuyNft>
      </div>
    </div>
  );
};
