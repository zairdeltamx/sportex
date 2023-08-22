import { useEffect, useState } from 'react';
import Web3 from 'web3';
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { nftaddress, nftmarketaddress } from '../config';
import axios from 'axios';
function useNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    if (window.ethereum) {
      // await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();

      const marketContract = new web3.eth.Contract(
        Market.abi,
        nftmarketaddress
      );
      const tokenContract = new web3.eth.Contract(NFT.abi, nftaddress);
      const data = await marketContract.methods
        .fetchMyNFTs()
        .call({ from: accounts[0] });

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.methods
            .tokenURI(i.tokenId)
            .call();
          const cleanedTokenUri = tokenUri.replace(
            'ipfs.infura.io',
            'sportex-staging.infura-ipfs.io'
          );

          const meta = await axios.get(cleanedTokenUri);
          const price = web3.utils.fromWei(i.price.toString(), 'ether');
          const cleanedImage = meta.data.image.replace(
            'ipfs.infura.io',
            'sportex-staging.infura-ipfs.io'
          );

          const item = {
            price,
            tokenId: parseInt(i.tokenId),
            seller: i.seller,
            name: meta.data.name,
            description: meta.data.description,
            owner: i.owner,
            image: cleanedImage,
            sold: i.sold,
          };
          return item;
        })
      );

      setNfts(items);
      setLoadingState(false);
    }
  }

  return [nfts, loadingState];
}

export default useNFTs;
