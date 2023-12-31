import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useLoadingContext } from '../../useContext/LoaderContext';
import styles from './NftInfo.module.css';
import { PurchaseButton } from '../../components/PurchaseButton';
import { GET_NFT } from '../../graphql/nft/graphql-queries';

const NftInfo = () => {
  const [nft, setNft] = useState(null);
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const { id } = useParams();
  const { loading } = useQuery(GET_NFT, {
    variables: { id: Number(id) },
    onCompleted: (data) => {
      const updatedNft = {
        ...data.getNFT,
        priceInUSD: (cryptoPrice * data.getNFT.price).toFixed(2),
      };
      console.log(updatedNft, 'UPDATED');
      setNft(updatedNft);
    },
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    const getCryptoPrice = async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
      );
      const data = await response.json();
      const bnbPrice = data['binancecoin']['usd'];
      setCryptoPrice(bnbPrice);
    };
    getCryptoPrice();
  }, []);

  if (loading) {
    return <p className={styles.loadingText}>Loading...</p>;
  }

  if (!nft) {
    return <p className={styles.loadingText}>Not found...</p>;
  }

  return (
    <div className={styles.containerNftInfo}>
      <div className={styles.contentNftInfo}>
        <div className={`${styles.gridItem} ${styles.imageNft}`}>
          <img src={nft?.image} alt="" />
        </div>

        <div className={`${styles.gridItem} ${styles.nameSale}`}>
          <div>
            <h1>{nft?.name}</h1>
            <p>{nft?.description}</p>
          </div>
          <div>
            <h1>Sale</h1>
            <p>{nft?.price}</p>
          </div>
        </div>
        <div className={`${styles.gridItem} ${styles.nftInfo}`}>
          <h1>NFT information</h1>
          <ul>
            <li>Seller: {nft?.seller}</li>
            <li>Creator: {nft?.owner}</li>
            <li>Token ID: {nft?.tokenId}</li>
            <li>Total copies of this NFT: 1</li>
            <li>Amount remaining: 1</li>
            <li>Is Transferable: Yes</li>
          </ul>
        </div>
        <div className={`${styles.gridItem} ${styles.createNft}`}>
          <h1>Create NFT</h1>
          <div className={styles.tableNftInfo}>
            <div className={`${styles.tableNftRow} ${styles.tableNftHeader}`}>
              <div className={styles.tableNftCell}>Característica</div>
              <div className={styles.tableNftCell}>Valor</div>
            </div>
            <div className={`${styles.tableNftRow} ${styles.attack}`}>
              <div className={styles.tableNftCell}>Attack</div>
              <div className={`${styles.tableNftCell} ${styles.value}`}>
                {nft?.attack}
              </div>
            </div>
            <div className={`${styles.tableNftRow} ${styles.defense}`}>
              <div className={styles.tableNftCell}>Defense</div>
              <div className={`${styles.tableNftCell} ${styles.value}`}>
                {nft?.defense}
              </div>
            </div>
            <div className={`${styles.tableNftRow} ${styles.strength}`}>
              <div className={styles.tableNftCell}>Strength</div>
              <div className={`${styles.tableNftCell} ${styles.value}`}>
                {nft?.strength}
              </div>
            </div>
            <div className={`${styles.tableNftRow} ${styles.teamName}`}>
              <div className={styles.tableNftCell}>Team name</div>
              <div className={`${styles.tableNftCell} ${styles.value}`}>
                {nft?.teamName}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.gridItem} ${styles.offers}`}>
          <h1>Offers</h1>
          <h1>sda</h1>
        </div>
        <div className={styles.purchaseButtonContainer}>
          <PurchaseButton className="buttonNftInfo" nft={nft} />
        </div>
      </div>
    </div>
  );
};

export default NftInfo;
