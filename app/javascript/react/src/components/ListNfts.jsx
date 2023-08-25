import React, { useEffect, useState } from 'react';

import styles from './ListNfts.module.css';
import NFTCard from './NFTCard';
export const ListNfts = ({ nfts, isMarketplace }) => {
  return (
    <div className={styles.listNfts}>
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          <NFTCard
            name={nft.name}
            token_id={nft.tokenId}
            isMarketplace={isMarketplace}
            nft={nft}
          />
        </div>
      ))}
    </div>
  );
};
