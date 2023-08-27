import { useState } from 'react';
import Fuse from 'fuse.js';
import { SorterNfts } from '../views/Welcome/SorterNfts';

const useNFTFilter = ({ initialNFTs }) => {
  console.log(initialNFTs, 'INITUAL');
  const [nfts, setNfts] = useState(initialNFTs);
  const [orderOptions, setOrderOptions] = useState({
    price: 'DESC',
    attack: '',
    strength: '',
    defense: '',
    name: 'NFT B',
    team: '',
  });

  const expressionOrder = (field, order) => {
    if (order === 'ASC') {
      return (a, b) => a[field] - b[field];
    }
    return (a, b) => b[field] - a[field];
  };
  const filter = () => {
    let sorterNFTs = [...nfts];
    if (orderOptions.name) {
      console.log(orderOptions, 'ORDER OPTIONS');

      const fuse = new Fuse(sorterNFTs, {
        keys: ['name'],
        includeMatches: true,
        threshold: 0,
      });

      const names = fuse.search(orderOptions.name).map((item) => item.item); //
      sorterNFTs = names;

      console.log(names, 'SORTER NFTS');
      //   console.log(so, 'RESPONSE NAME');
    }
    if (orderOptions.price) {
      sorterNFTs.sort(expressionOrder('price', orderOptions.price));
    }
    if (orderOptions.strength) {
      sorterNFTs.sort(expressionOrder('strength', orderOptions.strength));
    }
    if (orderOptions.attack) {
      sorterNFTs.sort(expressionOrder('strength', orderOptions.attack));
    }
    if (orderOptions.defense) {
      sorterNFTs.sort(expressionOrder('strength', orderOptions.defense));
    }
    console.log(sorterNFTs, 'SORTER');
  };

  return {
    filter,
    orderOptions,
    setOrderOptions,
  };
};

export default useNFTFilter;
