import React, { useEffect } from 'react';
import useNFTFilter from '../../hooks/useNFTFilter';

const NFTFilter = () => {
  const { filter } = useNFTFilter({
    initialNFTs: [
      {
        price: 20,
        attack: 10,
        strength: 8,
        defense: 5,
        name: 'NFT A',
        team: 'Team X',
      },
      {
        price: 22,
        attack: 8,
        strength: 7,
        defense: 6,
        name: 'NFT B',
        team: 'Team Y',
      },
      {
        price: 25,
        attack: 88,
        strength: 47,
        defense: 63,
        name: 'NFT B',
        team: 'Team Y',
      },
      // ... otros objetos NFT
    ],
  });

  useEffect(() => {
    filter();
  }, []);

  return <div>NFTFilter</div>;
};

export default NFTFilter;
