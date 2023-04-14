import React, { useState } from "react";

import { ButtonBuyNft } from "./buttonBuyNft/ButtonBuyNft";
import { ButtonDelistNft } from "./buttonDelistNft/ButtonDelistNft";
// Contracts and web3 libraries
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../config";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import changePrice from "../helpers/changePrice";

import { TogglableModal } from "./confirmModal/TogglableModal";
import { useMetamask } from "../useContext/MetamaskContext";
import { useLoadingContext } from "../useContext/LoaderContext";
import { notification } from "./alerts/notifications";

export const NftItem = ({ nft }) => {
  const { isAllowed } = useMetamask()
  const [askingPrice, setAskingPrice] = useState(0);
  const { addressMetamask } = useMetamask()
  const location = useLocation()
  const { setTransactionIsLoading } = useLoadingContext()

  async function changePriceProxy({ nft, price }) {
    console.log('changePriceProxy')
    try {
      setTransactionIsLoading(true)
      await changePrice(nft, price)
      setTransactionIsLoading(false)

      notification.showSuccess({ title: 'Success', message: 'The price will update in a few minutes' })
    } catch (error) {
      setTransactionIsLoading(false)
      console.log(error)
      notification.showSuccess({ title: 'Error', message: 'Failed update price, please try again' })
    }
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

      const transaction = await contract.resellToken(
        nftaddress,
        nft.tokenId,
        priceFormatted
      );

      await transaction.wait();
      setTransactionIsLoading(false)
      notification.showSuccess({ title: 'Success', message: 'The NFT will publish for sale in a few minutes' })
    } catch (error) {
      setTransactionIsLoading(false)
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
          location.pathname === '/myassets' ?
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
            </ TogglableModal> : location.pathname === '/' && nft.seller.toLowerCase() === addressMetamask ? <ButtonDelistNft nft={nft}/> : ''
        }

        {
          nft.seller.toLowerCase() === addressMetamask ? <TogglableModal
              onConfirm={changePriceProxy}
              params={{ nft: nft, price: askingPrice }}
              title='Enter asking price for NFT'
              buttonLabel='Change Price'>
              <form>
                <label>Asking Price:</label>
                <input
                  type='number'
                  placeholder='2 PLS'
                  onChange={e => setAskingPrice(e.target.value)}
                  autoFocus
                />
              </form>
            </ TogglableModal> : (location.pathname == '/myassets' ? '' : <ButtonBuyNft nft={nft} />)
        }
      </div>

    </div>
  );
};
