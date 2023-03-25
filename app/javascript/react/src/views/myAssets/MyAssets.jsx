import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { Loading } from "../../components/index";

import NFT from "../../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../../config";

import {
  Button,
  CardNft,
  ContentNFT,
  AppContainer,
  GridNFTs,
  ImgNft,
  Paragraph,
  Title,
  TextNFT,
} from "../../components/elements/Elements";
import { ModalResell } from "./ModalResell";
import axios from "axios";

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
    return <Loading></Loading>;
  }

  return (
    <div>
      <AppContainer w="90%" textCenter>
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
                  <TextNFT>
                    <Title weight="500" size="20px">
                      {nft.name}
                    </Title>
                    <Paragraph>Description:</Paragraph>
                    <Title weight="500" size="20px">
                      {nft.description}
                    </Title>
                    <Paragraph>Purchase price:</Paragraph>
                    <Title primary size="20px">
                      {nft.price} PLS
                    </Title>
                    <ModalResell
                      onConfirm={resellToken}
                      nft={nft}
                    ></ModalResell>
                    {isAutorized === true ? (
                      <Button
                        className=""
                        onClick={() => {
                          updateNft(nft.tokenId);
                        }}
                      >
                        Update NFT
                      </Button>
                    ) : null}
                  </TextNFT>
                </CardNft>
              </ContentNFT>
            </div>
          ))}
        </GridNFTs>
      </AppContainer>
    </div>
  );
}
