import React from 'react';

import NFTList from '../../components/NFTList';

import { Wave } from '../../components/Wave';
import { Loader } from '../../components/Loader';
import useNFTs from '../../helpers/loadNfts';
import styles from './MyAssets.module.css';
export default function MyAssets() {
  const [nfts, loadingState] = useNFTs();
  console.log(nfts, 'NFTSSS');
  return (
    <div style={{ marginTop: '80px' }}>
      <Wave />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>My assets</h1>
          {loadingState ? (
            <Loader />
          ) : nfts.length === 0 ? (
            <h1 style={{ textAlign: 'center', paddingTop: '20px' }}>
              Not found NFTs
            </h1>
          ) : (
            <NFTList nfts={nfts} isMarketplace={false} />
          )}
        </div>
      </div>
    </div>
  );
}
