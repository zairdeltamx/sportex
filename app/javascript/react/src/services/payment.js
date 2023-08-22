import Web3 from 'web3';
import Market from '../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftmarketaddress } from '../config';
import { deleteNft } from './nft';
import { notification } from '../components/alerts/notifications';

// const paymentCompleted = async ({ nftId, customer, seller }) => {
//   return await fetch("https://sportex-live-staging.herokuapp.com/tracking", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       nftId,
//       customer,
//       seller,
//     }),
//   });
// };
export const checkout = async ({ token, amount, nft, addressMetamask }) => {
  try {
    const response = await fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token.id,
        amount: amount,
        nftTokenId: nft.tokenId,
        buyerAddress: addressMetamask,
      }),
    });

    const resJson = await response.json();

    if (!resJson.success) {
      notification.showError({
        title: 'Error',
        message: resJson.message,
      });
      return {
        success: false,
        message: resJson.message,
      };
    }

    notification.showSuccess({
      title: 'Success',
      message: resJson.message,
    });

    return {
      success: true,
      message: resJson.message,
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error has occurred. Please try again later',
    };
  }
};

export const paymentMetamask = async ({ nft, addressMetamask, ev }) => {
  try {
    // ev.preventDefault();

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const contract = new web3.eth.Contract(Market.abi, nftmarketaddress);

    const price = web3.utils.toWei(nft.price.toString(), 'ether');

    const transaction = await contract.methods
      .purchaseItem(nft.tokenId)
      .send({ value: price, from: accounts[0] });

    // await transaction.wait();
    await deleteNft({ id: nft.id });

    // await paymentCompleted({
    //   nftId: nft.tokenId,
    //   customer: addressMetamask,
    //   seller: nft.seller,
    // });

    return {
      success: true,
      message: 'Your order has been placed successfully',
    };
  } catch (error) {
    console.log(error, 'ERROR PAYMENT');
    return {
      success: false,
      message: 'An error has occured. Please try again later',
    };
  }
};
