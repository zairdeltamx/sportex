import { ethers } from 'ethers';
import Market from '../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftmarketaddress } from '../config';

export default async function delistNft(nft) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    // Hacer la venta
    const transaction = await contract.delistNFT(nft.tokenId);
    await transaction.wait();
    notification.showSuccess({
      title: 'success',
      message: 'The NFT has been successfully unlisted',
    });
  } catch (error) {
    console.log(error);
    notification.showErrorWithButton({
      title: 'Error',
      message: 'Failed to unlist NFT, please try again later',
    });
  }
}
