import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import React from 'react'
import Navbar from "./navbar"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
export default function Home() {
  const [nfts, setNfts] =useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(()=>{
    loadNFTs()
  }, [])
  async function loadNFTs(){
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.v2b.testnet.pulsechain.com");
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

    //return an array of unsold market items
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const cleanedTokenUri = tokenUri.replace('ipfs.infura.io', 'sportex-staging.infura-ipfs.io');

      const meta = await axios.get(cleanedTokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      const cleanedImage = meta.data.image.replace('ipfs.infura.io', 'sportex-staging.infura-ipfs.io');

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: cleanedImage,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item;
    }));

    setNfts(items);
    setLoadingState('loaded')
  }

  async function buyNFT(nft){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    //set the price
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    //make the sale
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    });
    await transaction.wait();

    loadNFTs()
  }

  if(loadingState === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No items in market place</h1>
  )

  return (
   <div className="flex justify-center">
     <Navbar />
     <div className="px-4" style={{ maxWidth: '1600px', marginTop: "15px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {
          nfts.map((nft, i) =>(
            <div key={i} className="SportexNFT border shadow rounded-xl overflow-hidden" style={{width: "400px"}}>
              <img
                  src={nft.image}
                  alt="Picture of the author"
                  width={500}
                  height={500}
                  style={{ objectFit: "cover", width: "300px", height: "350px" }}
                  // blurDataURL="data:..." automatically provided
                  // placeholder="blur" // Optional blur-up while loading
                />
                <div className="p-4">
                <h3 className="text-lg font-semibold">Name:</h3>
                <p style={{ height: '64px'}} className="text-2xl font-semibold">
                  {nft.name}
                </p>
                <div style={{ height: '70px', overflow: 'hidden'}}>
                  <h3 className="text-lg font-semibold">Descripion:</h3>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                onClick={() => buyNFT(nft)}>Buy NFT</button>
            </div>
            </div>
          ))
        }
      </div>
     </div>
   </div>
  )
}
