import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";
import Web3Modal from "web3modal";

import NFT from "../../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../../config";
import { ListNfts } from "../../components/ListNfts";

import { ModalResell } from "./ModalResell";
import axios from "axios";
import { Wave } from "../../components/Wave";

export default function MyAssets() {
  const isAutorized = true

  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "bsc",
      cacheProvider: true,
    });
    // const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const cleanedTokenUri = tokenUri.replace(
          "ipfs.infura.io",
          "sportex-staging.infura-ipfs.io"
        );

        const meta = await axios.get(cleanedTokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const cleanedImage = meta.data.image.replace(
          "ipfs.infura.io",
          "sportex-staging.infura-ipfs.io"
        );

        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          name: meta.data.name,
          description: meta.data.description,
          owner: i.owner,
          image: cleanedImage,
        };
        return item;
      })
    );
    console.log(items);
    setNfts(items);
    setLoadingState(false);
  }

  async function resellToken({ nft, askingPrice }) {
    console.log(nft, "NFTRESELL");
    console.log(askingPrice, "ASKINGPRICE");
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

    loadNFTs();
  }

  if (loadingState && !nfts.length) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ marginTop: '80px' }}>
      <Wave />
      <div className="container_my_assets">
        <div className="content_my_assets">
          <h1>My assets</h1>
          <ListNfts nfts={nfts} />
          {/* <ModalResell
                      onConfirm={resellToken}
                      nft={nft}
                    ></ModalResell> */}
        </div>
      </div>
    </div>
  );
}
