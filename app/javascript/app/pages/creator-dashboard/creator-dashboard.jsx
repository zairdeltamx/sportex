import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Web3Modal from "web3modal";

import "./creator-dashboard.css";
import { nftaddress, nftmarketaddress } from "../../config";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import {
  Flex,
  GridNFTs,
  CardNft,
  Paragraph,
  Title,
  ImgNft,
  ContentNFT,
  Button,
} from "../../components/CustomStyledComponents";

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    //     {
    //   network: "mainnet",
    //   cacheProvider: true,
    // }
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchItemsListed();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          name: meta.data.name,
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
        };
        return item;
      })
    );
 
    setNfts(items);
    setLoadingState("loaded");
  }



  async function unList(tokenId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();


    const transaction = await contract.unListNFT(nftaddress,tokenId,{value:listingPrice});
    console.log("4");
    
    await transaction.wait();

    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="NoAssets">No assets created</h1>;
  return (
    <Fragment>
      <Flex justifyConten="center" alignItems="center" flexDirection="column">
        <Title>Items created:</Title>
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
                    <Paragraph>Price:</Paragraph>
                    <Title weight="500" size="20px">
                      {nft.price}
                    </Title>
                  </div>
                  <Button onClick={() => unList(nft.tokenId)}>Unlist</Button>
                </CardNft>
              </ContentNFT>
            </div>
          ))}
        </GridNFTs>
      </Flex>

     
    </Fragment>
  );
}
