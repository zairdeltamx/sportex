import { ethers } from 'ethers';
import Market from '../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftmarketaddress } from '../config';
import { notification } from '../components/alerts/notifications';

export default async function delistNft(nft) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  // Hacer la venta
  const transaction = await contract.delistNFT(nft.tokenId);
  await transaction.wait();
}
