import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import ConfirmModal from "../../components/confirmModal";


import { nftaddress, nftmarketaddress } from "../../config";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

import {
  Button,
  Flex,
  Title,
  Paragraph,
  CardNft,
  ContentNFT,
  ImgNft,
  GridNFTs,
} from "../../components/CustomStyledComponents";
import styled from "./my-assets.module.css";
import CreatorDashboard from "../creator-dashboard/creator-dashboard";


export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [saleNft, setSaleNft] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);


  
  async function loadNFTs() {
    // const web3Modal = new Web3Modal({
    //   network: "mainnet",
    //   cacheProvider: true,
    // })
    const web3Modal = new Web3Modal();
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

      console.log(data,"MYASSETS");
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const cleanedTokenUri = tokenUri.replace(
          "ipfs.infura.io",
          "sportex-staging.infura-ipfs.io"
        );

        const meta = await axios.get(cleanedTokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const cleanedImage = meta.data.image.replace(
          "ipfs.infura.io",
          "sportex-staging.infura-ipfs.io"
        );

        let item = {
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
    setNfts(items);
    setLoadingState("loaded");
  }

  async function resellToken(nft, askingPrice) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    console.log(typeof (askingPrice, "tipo"));
    const priceFormatted = ethers.utils.parseEther(askingPrice);
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    console.log(typeof (priceFormatted, "tipo"));

    listingPrice = listingPrice.toString();
    console.log("contract", contract);
    console.log("nft", nft.tokenId);
    console.log("askingPrice", priceFormatted);
    //set the
    //make the sale
    const transaction = await contract.resellToken(
      nftaddress,
      nft.tokenId,
      priceFormatted,
      { value: listingPrice }
    );

    await transaction.wait();

    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>;

  return (
    <Fragment>
      <ConfirmModal
        setDisplayModal={setDisplayModal}
        displayModal={displayModal}
        nft={saleNft}
        onConfirm={resellToken}
      />
      <Flex justifyConten="center" alignItems="center" flexDirection="column">
        <Title>NFTs:</Title>
        <GridNFTs>
          {nfts.map((nft, i) => (
            <div key={i}>
              <ContentNFT>
                <CardNft>
                  <ImgNft
                    src={nft.image}
                    alt="Picture of the author"
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                  />
                  <div>
                    <Title weight="500" size="20px">
                      {nft.name}
                    </Title>
                    <Paragraph>Description:</Paragraph>
                    <Title weight="500" size="20px">
                      {nft.description}
                    </Title>
                  </div>
                  <div>
                    <Paragraph>Purchase price:</Paragraph>
                    <Title secondary size="20px">
                      {nft.price} PLS
                    </Title>
                    <Button
                      className=""
                      onClick={() => {
                        setSaleNft(nft);
                        setDisplayModal(true);
                      }}
                    >
                      Sell NFT
                    </Button>
                    <Button
                      className=""
                      onClick={() => {
                        updateNft(nft.tokenId)
                      }}
                    >
                      Update NFT
                    </Button>
                  </div>
                </CardNft>
              </ContentNFT>
            </div>
          ))}
          </GridNFTs>
      </Flex>
<hr /><hr />
      <CreatorDashboard></CreatorDashboard>
    </Fragment>
  );
}
