import React from 'react';
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
} from '../../components/elements/Elements';
// Library axios
import axios from 'axios';
// Contracts and web3 libraries
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import Market from '../../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftaddress, nftmarketaddress } from '../../config';
// Redux
import { useSelector } from 'react-redux';

export const Nfts = ({ nfts }) => {
	console.log(nfts, 'NFT');
	const isAutorized = useSelector(state => state.addressReducer.Authorized);

	const deleteNft = async id => {
		axios.delete(`https://sportex.herokuapp.com/v1/deleteNft/${id}`);
		// fetch(`http://localhost:3000/v1/delete_nft/${id}`, {
		// 	method: 'DELETE',
		// 	headers: { 'Access-Control-Allow-Origin': '*' },
		// });
	};
	async function buyNFT(nft) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);

		// sign the transaction
		const signer = provider.getSigner();
		const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

		// set the price
		console.log('1');
		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
		console.log('2');
		// make the sale
		console.log(price, 'PRICE');
		const transaction = await contract.createMarketSale(
			nftaddress,
			nft.tokenId,
			{
				value: price,
			}
		);
		console.log('3');
		await transaction.wait();
		deleteNft(nft.id);
	}
	async function unList(nft) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const marketContract = new ethers.Contract(
			nftmarketaddress,
			Market.abi,
			signer
		);

		try {
			const tx = await marketContract.cancelMarketItem(nftaddress, nft.tokenId);
			await tx.wait();
			console.log('NFT cancelado exitosamente');
			// actualizar el estado de la aplicación para reflejar que el NFT ha sido cancelado
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<GridNFTs>
			{nfts.map((nft, i) => (
				<div key={i}>
					<ContentNFT>
						<CardNft>
							<ImgNft
								src={nft.image}
								alt='Picture of the author'
							// blurDataURL="data:..." automatically provided
							// placeholder="blur" // Optional blur-up while loading
							/>
							<TextNFT>
								<Title weight='800' size='30px'>
									{nft.name}
								</Title>
								<Title size='20px'>Description:</Title>
								<Paragraph weight='500' size='13px'>
									{nft.description}
								</Paragraph>
								<Title size='20px'>Meta:</Title>
								{Object.entries(nft.meta).map(([key, value], i) => (
									<Paragraph weight='500' size='13px' key={i}>
										{key}:{value}
									</Paragraph>
								))}
								<Title size='20px'>Current Bid</Title>
								<Paragraph primary size='13px' weight='500'>
									{nft.price} PLS
								</Paragraph>

								<Button className='' onClick={() => buyNFT(nft)}>
									Buy NFT
								</Button>
								{isAutorized ? (
									<Button className='' onClick={() => unList(nft)}>
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
