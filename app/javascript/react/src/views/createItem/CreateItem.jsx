import { create as ipfsHttpClient } from 'ipfs-http-client';
import React, { Fragment, useEffect, useState } from 'react';
import './styles.css';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import Web3Modal from 'web3modal';

import NFT from '../../../hardhat/artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftaddress, nftmarketaddress } from '../../config';

import { Button, Title } from '../../components/elements/Elements';
import { FormCreateNfts } from './FormCreateNfts';
const client = ipfsHttpClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization:
			'Basic MkRnRGNzc0pHaGdxbEZKUUYzOHZ3U0RqRHBEOjQ0NGNhMWFjMTAwOWQxODljODU0ZGEyZmNhYmUwZGYy',
	},
});

export default function CreateItem() {
	const [fileUrl, setFileUrl] = useState(null);
	const [formInput, updateFormInput] = useState({
		price: '',
		name: '',
		description: '',
		meta: '',
	});
	const navigate = useNavigate();
	async function onChange(e) {
		const file = e.target.files[0];
		try {
			//try uploading the file
			const added = await client.add(file, {
				progress: prog => console.log(`received: ${prog}`),
			});
			//file saved in the url path below
			const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;
			setFileUrl(url);
		} catch (e) {
			console.log('Error uploading file: ', e);
		}
	}

	//1. create item (image/video) and upload to ipfs
	async function createItem() {
		const { name, description, price, meta } = formInput; //get the value from the form input

		//form validation
		if (!name || !description || !price || !fileUrl || !meta) {
			return;
		}

		const data = JSON.stringify({
			name,
			description,
			image: fileUrl,
			meta,
		});

		try {
			const added = await client.add(data);
			const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;
			//pass the url to sav eit on Polygon adter it has been uploaded to IPFS
			createSale(url, data);
		} catch (error) {
			console.log(`Error uploading file: `, error);
		}
	}

	//2. List item for sale
	async function createSale(url, meta) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);

		//sign the transaction
		const signer = provider.getSigner();
		let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
		let transaction = await contract.createToken(url, meta);
		let tx = await transaction.wait();
		console.log(tx, 'TX');
		//get the tokenId from the transaction that occured above
		//there events array that is returned, the first item from that event
		//is the event, third item is the token id.
		console.log('Transaction: ', tx);
		console.log('Transaction events: ', tx.events[0]);
		let event = tx.events[0];
		let value = event.args[2];
		let tokenId = value.toNumber(); //we need to convert it a number

		//get a reference to the price entered in the form
		const price = ethers.utils.parseUnits(formInput.price, 'ether');

		contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

		//get the listing price
		let listingPrice = await contract.getListingPrice();
		listingPrice = listingPrice.toString();

		transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
			value: listingPrice,
		});

		await transaction.wait();

		navigate('/');
	}

	return (
		<Fragment>
			<div className="containerCreateItem" >
				<div></div>
				<Title black>Create NFT</Title>
				<br />
				<br />
				<FormCreateNfts
					formInput={formInput}
					fileUrl={fileUrl}
					onChange={onChange}
					updateFormInput={updateFormInput}></FormCreateNfts>
				<br />
				<br />
				<Button onClick={createItem} className=''>
					Create NFT
				</Button>
			</div>
		</Fragment >
	);
}
