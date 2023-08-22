import { ethers } from 'ethers';
import Market from '../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftmarketaddress } from '../config';
import { notification } from '../components/alerts/notifications';

export default async function changePriceProxy({ nft, price }) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  console.log('contract', contract);
  console.log('nft.tokenId', nft.tokenId);

  const priceFormatted = ethers.utils.parseEther(price);
  console.log('priceFormatted', priceFormatted);

  try {
    const transaction = await contract.changePrice(nft.tokenId, priceFormatted);
    // await transaction.wait();
    notification.showSuccess({
      title: 'success',
      message: 'The NFT price has been changed correctly',
    });
  } catch (error) {
    console.error('Error:', error);
    notification.showErrorWithButton({
      title: 'Error',
      message: 'Error when changing price, try again later',
    });
  }
}
