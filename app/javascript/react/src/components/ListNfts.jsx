import React, { useEffect, useState } from 'react';
import { ItemNFT } from './ItemNFT';
import styles from './ListNfts.module.css';
export const ListNfts = ({ nfts, isMarketplace }) => {
  return (
    <div className={styles.listNfts}>
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          <ItemNFT isMarketplace={isMarketplace} nft={nft} />
        </div>
      ))}
    </div>
  );
};
