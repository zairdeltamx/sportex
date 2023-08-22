import { ethers } from 'ethers';
import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json';
import { notification } from '../components/alerts/notifications';
import { allowance } from './allowanceNft';

export async function approve({ setnftIsApproval, tokenId }) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);

    const approveTx = await nftContract.approve(nftmarketaddress, tokenId);
    // await approveTx.wait();

    notification.showSuccess({
      title: 'success',
      message: 'NFT has been approved for sale',
    });

    const requestAallowance = await allowance({
      tokenId,
    });

    console.log('ALLOWANCE APPROVAL', requestAallowance);
    return requestAallowance;
  } catch (error) {
    console.log(error, 'ERR');
    notification.showErrorWithButton({
      title: 'Error',
      message: 'Failed to approve nft',
    });
  }
}
