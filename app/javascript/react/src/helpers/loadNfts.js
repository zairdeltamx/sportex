import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import NFT from "../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { nftaddress, nftmarketaddress } from "../config";
import axios from "axios";

function useNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    });
    
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const fetchedData = await marketContract.fetchMyNFTs();
    const data = fetchedData.filter((i) => i.presale === false);
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const cleanedTokenUri = tokenUri.replace(
          "ipfs.infura.io",
          "sportex-staging.infura-ipfs.io"
        );

        const meta = await axios.get(cleanedTokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const cleanedImage = meta.data.image.replace(
          "ipfs.infura.io",
          "sportex-staging.infura-ipfs.io"
        );

        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
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

  return [nfts, loadingState];
}

export default useNFTs;
