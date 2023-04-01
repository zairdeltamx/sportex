import React from "react";

import { ButtonBuyNft } from "./buttonBuyNft/ButtonBuyNft";
// Contracts and web3 libraries
import buyNFT from "../helpers/buyNft";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../config";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { notification } from "./alerts/notifications";
import { markAsSold } from "../services/nft";
import { ButtonResellNft } from "./ButtonResellNft";
export const NftItem = ({ nft }) => {
  const location = useLocation()
  console.log(location, "LOCATION");
  const isAutorized = true;

  async function handleBuyNft(nft) {
    try {
      await buyNFT(nft);
      await markAsSold({ id: nft.id });
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
      <div className="container_card">
        <div className="container_image_card">
          <Link to={`nftdetail/${nft.id}`}>
            <img src={nft.image} alt="" />
          </Link>
        </div>
        <div className="container_name_card">
          <h1>{nft.name}</h1>
          <p>Soccer player</p>
        </div>
        <hr />
        <div className="container_price_card">
          <p>Current Bid</p>
          <p>{nft.price}</p>
        </div>
        <div className="buttons_nft_item">
          {
            location.pathname === '/myassets' ?
              <ButtonResellNft></ButtonResellNft> : ''
          }
          <ButtonBuyNft nft={handleBuyNft}></ButtonBuyNft>
        </div>
      </div>
    </div>
  );
};
