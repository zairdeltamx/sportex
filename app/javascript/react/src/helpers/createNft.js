import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import Web3Modal from 'web3modal';

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftaddress, nftmarketaddress } from '../config';

// 1. create item (image/video) and upload to ipfs
export async function createItem({ formInput, fileUrl, client }) {
	const { name, description, price } = formInput; // get the value from the form input
	// form validation
	if (!name || !description || !price || !fileUrl) {
		return;
	}

	const data = JSON.stringify({
		name,
		description,
		image: fileUrl,
	});

	try {
		const added = await client.add(data);
		const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;
		// pass the url to sav eit on Polygon adter it has been uploaded to IPFS
		createSale(url, data);
	} catch (error) {
		console.log(error);
	}
}

// 2. List item for sale
async function createSale(url, meta) {
	console.log(url, meta);
	const navigate = useNavigate();
	const web3Modal = new Web3Modal();
	const connection = await web3Modal.connect();
	const provider = new ethers.providers.Web3Provider(connection);

	// sign the transaction
	const signer = provider.getSigner();
	let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
	let transaction = await contract.createToken(url, meta);
	const tx = await transaction.wait();

	// get the tokenId from the transaction that occured above
	// there events array that is returned, the first item from that event
	// is the event, third item is the token id.

	const event = tx.events[0];
	const value = event.args[2];
	const tokenId = value.toNumber(); // we need to convert it a number

	// get a reference to the price entered in the form
	const price = ethers.utils.parseUnits(formInput.price, 'ether');

	contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

	// get the listing price
	let listingPrice = await contract.getListingPrice();
	listingPrice = listingPrice.toString();

	transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
		value: listingPrice,
	});

	await transaction.wait();

	navigate('/');
}
