import React from "react";
// Elements that styledComponent
import {
  Button,
  CardNft,
  ContentNFT,
  GridNFTs,
  ImgNft,
  Paragraph,
  TextNFT,
  Title,
} from "../../components/elements/Elements";
// Contracts and web3 libraries
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Market from "../../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../../config";
// Redux
import { useSelector } from "react-redux";
import { deleteNft } from "../../services/nft";
export const Nfts = ({ nfts }) => {
  const isAutorized = useSelector((state) => state.addressReducer.Authorized);

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    // set the price
    console.log("1");
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    console.log("2");
    // make the sale
    console.log(price, "PRICE");
    const transaction = await contract.createMarketSale(
      nftddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    console.log("3");
    await transaction.wait();
    await deleteNft({ id: nft.id });
    window.location.reload();
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

    loadNFTs();
  }

  return (
    <GridNFTs>
      {nfts.map((nft, i) => (
        <div key={i}>
          <ContentNFT>
            <CardNft>
              <ImgNft src={nft.image} alt="Picture of the author" />
              <TextNFT>
                <Title weight="800" size="30px">
                  {nft.name}
                </Title>
                <Title size="20px">Description:</Title>
                <Paragraph weight="500" size="13px">
                  {nft.description}
                </Paragraph>
                <Title size="20px">Meta:</Title>

                <Title size="20px">Current Bid</Title>
                <Paragraph primary size="13px" weight="500">
                  {nft.price} PLS
                </Paragraph>

                <Button className="" onClick={() => buyNFT(nft)}>
                  Buy NFT
                </Button>
                {isAutorized ? (
                  <Button className="" onClick={() => deListNFT(nft)}>
                    Unlist
                  </Button>
                ) : null}
              </TextNFT>
            </CardNft>
          </ContentNFT>
        </div>
      ))}
    </GridNFTs>
  );
};
