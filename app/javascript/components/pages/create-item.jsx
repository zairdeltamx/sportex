import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient} from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import React from 'react'
import NavbarComponent from "../utils/navbar"
import { useNavigate } from 'react-router-dom'

import imageNftBanner from '../img/NFT.png';

import '../css/create-item.css'
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization:
    'Basic MkRnRGNzc0pHaGdxbEZKUUYzOHZ3U0RqRHBEOjQ0NGNhMWFjMTAwOWQxODljODU0ZGEyZmNhYmUwZGYy',
  }})

import {
    nftaddress, nftmarketaddress
} from '../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({price: '', name: '', description:'', meta_json: ''})
    const navigate = useNavigate()
    async function onChange(e) {
        const file = e.target.files[0]
        try{ //try uploading the file
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            //file saved in the url path below
            const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`
            setFileUrl(url)
        }catch(e){
            console.log('Error uploading file: ', e)
        }
    }

    //1. create item (image/video) and upload to ipfs
    async function createItem(){
        const {name, description, price, meta_json} = formInput; //get the value from the form input

        //form validation
        if(!name || !description || !price || !fileUrl) {
            return
        }

        const data = JSON.stringify({
            name, description, image: fileUrl
        });

        try{
            const added = await client.add(data)
            const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`
            //pass the url to sav eit on Polygon adter it has been uploaded to IPFS
            createSale(url, meta_json)
        }catch(error){
            console.log(`Error uploading file: `, error)
        }
    }

    //2. List item for sale
    async function createSale(url, meta){
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        //sign the transaction
        const signer = provider.getSigner();
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        console.log(meta)
        let transaction = await contract.createToken(url, meta);
        let tx = await transaction.wait()

        //get the tokenId from the transaction that occured above
        //there events array that is returned, the first item from that event
        //is the event, third item is the token id.
        console.log('Transaction: ',tx)
        console.log('Transaction events: ',tx.events[0])
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber() //we need to convert it a number

        //get a reference to the price entered in the form
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

        //get the listing price
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(
          nftaddress, tokenId, price, { value: listingPrice }
        )

        await transaction.wait()

        navigate("/")
    }

    return (
        <div >
            <NavbarComponent />

        <div className='background-create'>

            <div className="create">


                <div className='form'>
                <h1 className='text-style'>Complete the data:</h1>

                <input
                    placeholder="Asset Name"
                    className=""
                    onChange={e => updateFormInput({...formInput, name: e.target.value})}
                    />
                <textarea
                     placeholder="Asset description"
                     className=""
                     onChange={e => updateFormInput({...formInput, description: e.target.value})}
                     />
                <input
                    placeholder="Asset Price in PLS"
                    className=""
                    type="number"
                    onChange={e => updateFormInput({...formInput, price: e.target.value})}
                    />
                <hr />
                <textarea
                     placeholder="Meta data"
                     className=""
                     onChange={e => updateFormInput({...formInput, meta_json: e.target.value})}
                     />
                    <input
                        type="file"
                        name="Asset"
                        className="my-4"
                        onChange={onChange}
                    />

                    <button onClick={createItem}
                     className=""
                     >Create NFT</button>
                </div>

            <div className="previewNFT">

            {
                        fileUrl && (
                          <div>
                            <h1 className='text-style'>Preview image:</h1>
                            <img
                                    src={fileUrl}
                                    alt="Picture of the author"
                                    className="rounded mt-4"
                                    width={300}
                                    height={400} />
                          </div>
                        )
                    }
                    </div>
                     </div>
                     </div>

        </div>
    )
}
