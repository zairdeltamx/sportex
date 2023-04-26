import React, { Fragment, useEffect, useState } from "react";

import { ButtonBuyNft } from "./buttonBuyNft/ButtonBuyNft";
import { ButtonDelistNft } from "./buttonDelistNft/ButtonDelistNft";
// Contracts and web3 libraries
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftmarketaddress } from "../config";

import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import changePrice from "../helpers/changePrice";

import { TogglableModal } from "./confirmModal/TogglableModal";
import { useMetamask } from "../useContext/MetamaskContext";
import { useLoadingContext } from "../useContext/LoaderContext";
import { notification } from "./alerts/notifications";
import { allowance } from "../helpers/allowanceNft";
import { approve } from "../helpers/approveNft";
import { Loader } from "./Loader";

export const NftItem = ({ nft, unitDolar }) => {
  const [nftIsApproved, setnftIsApproval] = useState(false);
  const [askingPrice, setAskingPrice] = useState(0);
  const [transferAddress, setTransferAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { addressMetamask } = useMetamask();
  const location = useLocation();
  const { setTransactionIsLoading } = useLoadingContext();

  useEffect(() => {
    setTransactionIsLoading(true);
    setLoading(true);

    async function handleAllowance() {
      const requestAllowance = await allowance({
        setTransactionIsLoading,
        tokenId: nft.tokenId,
      }).finally(() => {
        setLoading(false);
      });
      setnftIsApproval(requestAllowance);
    }
    handleAllowance();
  }, []);

  async function changePriceProxy({ nft, price }) {
    try {
      setTransactionIsLoading(true);
      await changePrice(nft, price);

      notification.showSuccess({
        title: "Success",
        message: "The price will update in a few minutes",
      });
    } catch (error) {
      console.log(error);
      notification.showSuccess({
        title: "Error",
        message: "Failed update price, please try again",
      });
    } finally {
      setTransactionIsLoading(false);
    }
  }

  async function transferToken({ nft, transferAddress }) {
    try {
      setTransactionIsLoading(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      // sign the transaction
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );

      console.log("TOKENID", nft.tokenId);
      console.log("ADDRESS", transferAddress);
      const transaction = await contract.transferTo(
        transferAddress,
        nft.tokenId
      );

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
    } finally {
      setTransactionIsLoading(false);
    }
  }

  async function resellToken({ nft, askingPrice }) {
    try {
      setTransactionIsLoading(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      // sign the transaction
      const signer = provider.getSigner();
      const priceFormatted = ethers.utils.parseEther(askingPrice);
      const contract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );

      const transaction = await contract.resellToken(
        nft.tokenId,
        priceFormatted
      );

      await transaction.wait();
      notification.showSuccess({
        title: "Success",
        message: "The NFT will publish for sale in a few minutes",
      });
      window.location.replace("/");
    } catch (error) {
      console.log(error);
      notification.showSuccess({
        title: "Error",
        message: "Failed to resell NFT, please try again",
      });
    } finally {
      setTransactionIsLoading(false);
    }
  }

  const renderButtons = () => {
    if (location.pathname === "/myassets") {
      if (!nftIsApproved) {
        console.log(nftIsApproved, "ISAPPROVED");
        return (
          <button
            onClick={() =>
              approve({
                address: addressMetamask,
                setnftIsApproval,
                setTransactionIsLoading,
                tokenId: nft.tokenId,
              })
            }
          >
            Approve NFT
          </button>
        );
      } else {
        return (
          <Fragment>
            <TogglableModal
              onConfirm={resellToken}
              params={{ nft, askingPrice }}
              title="Enter asking price for NFT"
              buttonLabel="Resell"
            >
              <form>
                <label>Asking Price:</label>
                <input
                  type="number"
                  placeholder="2 PLS"
                  onChange={(e) => setAskingPrice(e.target.value)}
                  autoFocus
                />
              </form>
            </TogglableModal>
            <TogglableModal
              onConfirm={transferToken}
              params={{ nft, transferAddress }}
              title="Enter Address to transfer"
              buttonLabel="Transfer"
            >
              <form>
                <label>Address to transfer:</label>
                <input
                  type="text"
                  placeholder="ERC-20 Address to transfer"
                  onChange={(e) => setTransferAddress(e.target.value)}
                  autoFocus
                />
              </form>
            </TogglableModal>
          </Fragment>
        );
      }
    } else if (location.pathname === "/") {
      if (nft.seller.toLowerCase() === addressMetamask) {
        return (
          <Fragment>
            <TogglableModal
              onConfirm={changePriceProxy}
              params={{ nft, price: askingPrice }}
              title="Enter asking price for NFT"
              buttonLabel="Change Price"
            >
              <form>
                <label>Asking Price:</label>
                <input
                  type="number"
                  placeholder="2 PLS"
                  onChange={(e) => setAskingPrice(e.target.value)}
                  autoFocus
                />
              </form>
            </TogglableModal>
            <ButtonDelistNft nft={nft} />
          </Fragment>
        );
      } else {
        return <ButtonBuyNft nft={nft} />;
      }
    }
  };

  return (
    <div className="container_card">
      {loading && <Loader />}
      {!loading && (
        <Fragment>
          <div className="container_image_card">
            <Link to={`/nftdetail/${nft.tokenId}`}>
              <img src={nft.image} alt="" />
            </Link>
          </div>
          <div className="container_name_card">
            <h1>
              {nft.name} #{nft.tokenId}
            </h1>
            <p>Soccer player</p>
          </div>
          <hr />
          <div className="container_price_card">
            <p>Current Price</p>
            <div>
              <span className="unitDolar" style={{ textAlign: "center" }}>
                {(unitDolar * nft.price).toFixed(2)}USD
              </span>{" "}
              <span className="unitPLS">{nft.price} BNB</span>
            </div>
          </div>
          <div className="buttons_nft_item">{renderButtons()}</div>
        </Fragment>
      )}
    </div>
  );
};
