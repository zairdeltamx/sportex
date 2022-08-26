import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useEffect , useState } from "react"
import axios from "axios"
import React from 'react'
import NavbarComponent from "../utils/navbar"
import ConfirmModal from "../utils/confirmModal"

import {
    nftaddress, nftmarketaddress
  } from '../config'

  import '../css/index.css'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [saleNft, setSaleNft] = useState(false)
    const [displayModal, setDisplayModal] = useState(false)
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
      loadNFTs()
    }, [])

    async function loadNFTs() {
      // const web3Modal = new Web3Modal({
      //   network: "mainnet",
      //   cacheProvider: true,
      // })
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()

      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const data = await marketContract.fetchMyNFTs()

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const cleanedTokenUri = tokenUri.replace('ipfs.infura.io', 'sportex-staging.infura-ipfs.io');

        const meta = await axios.get(cleanedTokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const cleanedImage = meta.data.image.replace('ipfs.infura.io', 'sportex-staging.infura-ipfs.io');

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          name: meta.data.name,
          description: meta.data.description,
          owner: i.owner,
          image: cleanedImage
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded')
    }

    async function resellToken(nft, askingPrice){


      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      //sign the transaction
      const signer = provider.getSigner();
      console.log(typeof(askingPrice,"tipo") );
      const priceFormatted = ethers.utils.parseEther(askingPrice);
      const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      let listingPrice = await contract.getListingPrice()
      console.log(typeof(priceFormatted,"tipo") );

      listingPrice = listingPrice.toString()
      console.log('contract', contract)
      console.log('nft', nft.tokenId)
      console.log('askingPrice', priceFormatted)
      //set the 
      //make the sale
      const transaction = await contract.resellToken(nftaddress,nft.tokenId, priceFormatted,{value:listingPrice});
      
      await transaction.wait();

      loadNFTs()
    }

    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)

    return (
      <div className="flex justify-center">
        <NavbarComponent />
        <ConfirmModal setDisplayModal={setDisplayModal} displayModal={displayModal} nft={saleNft} onConfirm={resellToken} />
        <h1 className="text-styleNFTs" >Your NFTs:</h1>
     <div className="content-cards">
      <div className="conten-nfts">
            {
              nfts.map((nft, i) => (
                
                
                <div key={i}  className="content-card">
                <div className="card-nft" >
                  <img
                      src={nft.image}
                      alt="Picture of the author"
                      // blurDataURL="data:..." automatically provided
                      // placeholder="blur" // Optional blur-up while loading
                    />
                  <div >
                    <p className="name-nft">
                      {nft.name}
                    </p>
                    <div className="description-nft">
                      <h3 >Description:</h3>
                      <p >{nft.description}</p>
                    </div>
                  </div>
                  <div className="price-nft">
                    <h3>Purchase price:</h3>
                    <p >
                      {nft.price} PLS
                    </p>
                    <button className=""
                    onClick={() => {setSaleNft(nft);setDisplayModal(true)}}>Sell NFT</button>
                  </div>
                </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
