import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import React from "react";

import { nftaddress, nftmarketaddress } from "../../config";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { Banner } from "../../components/banner";

import {
  Button,
  CardNft,
  ContentNFT,
  Flex,
  GridNFTs,
  ImgNft,
  Paragraph,
  Title
} from "../../components/CustomStyledComponents";
import styled from "./index.module.css"
export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.v2b.testnet.pulsechain.com"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );

    //return an array of unsold market items
    const data = await marketContract.fetchMarketItems();
console.log(data,"INDEX");
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
          owner: i.owner,
          image: cleanedImage,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    //set the price
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    //make the sale
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();

    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div className="flex justify-center">
        <h1 className="px-20 py-10 text-3xl">No items in market place</h1>
      </div>
    );

  return (
    <Fragment>
      <Banner />
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
                    <Paragraph>Current Bid</Paragraph>
                    <Title secondary size="20px">
                      {nft.price} PLS
                    </Title>
                    <Button className="" onClick={() => buyNFT(nft)}>
                      Buy NFT
                    </Button>
                  </div>
                  </CardNft>
            </ContentNFT>
            </div>

          ))}
        </GridNFTs>
      </Flex>
    </Fragment>
  );
}
