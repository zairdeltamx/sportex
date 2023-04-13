import React, { useState } from "react";

import { ButtonBuyNft } from "./buttonBuyNft/ButtonBuyNft";
// Contracts and web3 libraries
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../config";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { TogglableModal } from "./confirmModal/TogglableModal";
import { useMetamask } from "../useContext/MetamaskContext";
import { LoaderBlock } from "./LoaderBlock";
import { useLoadingContext } from "../useContext/LoaderContext";
import { notification } from "./alerts/notifications";
export const NftItem = ({ nft }) => {
  const { isAllowed } = useMetamask()
  const [askingPrice, setAskingPrice] = useState(0);
  const { addressMetamask } = useMetamask()
  const location = useLocation()
  const { setTransactionIsLoading } = useLoadingContext()

  async function deListNFT(nft) {
    setTransactionIsLoading(true)
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();

    const transaction = await contract.delistNFT(nftaddress, nft.tokenId, {
      value: listingPrice,
    });
    await transaction.wait();
    setTransactionIsLoading(false)
  }

  async function resellToken({ nft, askingPrice }) {
    try {
      setTransactionIsLoading(true)
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      // sign the transaction
      const signer = provider.getSigner();
      const priceFormatted = ethers.utils.parseEther(askingPrice);
      const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();

      listingPrice = listingPrice.toString();

      // set the
      // make the sale
      const transaction = await contract.resellToken(
        nftaddress,
        nft.tokenId,
        priceFormatted,
        { value: listingPrice }
      );

      await transaction.wait();
      setTransactionIsLoading(false)
      notification.showSuccess({ title: 'Success', message: 'The NFT has been published correctly' })
    } catch (error) {
      notification.showSuccess({ title: 'Error', message: 'Failed to resell NFT, please try again' })
    }
  }

  return (

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
        <p>Current Price</p>
        <p>{nft.price}</p>
      </div>
      <div className="buttons_nft_item">
        {
          location.pathname === '/myassets' && isAllowed ?
            <TogglableModal
              onConfirm={resellToken}
              params={{ nft: nft, askingPrice: askingPrice }}
              title='Enter asking price for NFT'
              buttonLabel='Resell'>
              <form>
                <label>Asking Price:</label>
                <input
                  type='number'
                  placeholder='2 PLS'
                  onChange={e => setAskingPrice(e.target.value)}
                  autoFocus
                />

              </form>
            </ TogglableModal> : location.pathname === '/' && nft.owner.toLowerCase() === addressMetamask ? <button >Delist</button> : ''
        }
        <ButtonBuyNft nft={nft} />
      </div>

    </div>
  );
};
