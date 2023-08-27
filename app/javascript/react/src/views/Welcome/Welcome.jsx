import React, { useState, useEffect } from 'react';
import { Pagination } from '../../components';
import { Banner } from '../../layouts/banner/Banner';
import NFTList from '../../components/NFTList';
import { Wave } from '../../components/Wave';
import styles from './index.module.css';
import { Loader } from '../../components/Loader';
import { SorterNfts } from './SorterNfts';
import { useGetNfts } from '../../graphql/nft/custom-hooks';
import { GET_NFTS } from '../../graphql/nft/graphql-queries';
import { useGraphqlContext } from '../../useContext/GraphqlContext';
import fetchCryptoPrice from '../../services/cryptoPrice';
import FilterComponent from './FilterComponent';
import NFTFilter from '../../components/NFTFilter/NFTFilter';

const Welcome = () => {
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const { currentPage, setCurrentPage } = useGraphqlContext();
  const { loading, data, error, refetch } = useGetNfts({
    currentPage: currentPage,
  });

  useEffect(() => {
    const fetchBnbPrice = async () => {
      setCryptoPrice(await fetchCryptoPrice());
    };
    fetchBnbPrice();
  }, []);

  const nfts = data?.allNFTs.nfts || []; // Access nfts collection from data
  const nftsWithPriceInUSD = nfts.map((nft) => ({
    ...nft,
    priceInUSD: cryptoPrice
      ? Number((cryptoPrice * nft.price).toFixed(2))
      : null,
  }));

  const mark = () => {
    markSold({
      variables: { id: 30 },
      refetchQueries: [{ query: GET_NFTS }],
    });
  };
  return (
    <div>
      <Banner />
      <Wave />
      <div className={styles.containerIndex}>
        <div className={styles.contentIndex}>
          <h1>Explore players</h1>
          <br />
          <br />
          <br />
          <NFTFilter />
          <SorterNfts
            // setCurrentPage={setCurrentPage}
            refetch={refetch}
            currentPage={currentPage}
          />

          {loading ? (
            <Loader />
          ) : nfts.length === 0 ? (
            <h1 style={{ textAlign: 'center', paddingTop: '20px' }}>
              Not found NFTs
            </h1>
          ) : !nftsWithPriceInUSD.some((nft) => nft.priceInUSD === null) ? (
            <NFTList isMarketplace={true} nfts={nftsWithPriceInUSD} />
          ) : (
            <h1 style={{ textAlign: 'center', paddingTop: '20px' }}>
              NFTs not ready, please wait
            </h1>
          )}

          <Pagination
            totalPages={data?.allNFTs.totalPages || 1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></Pagination>
        </div>
      </div>
    </div>
  );
};
export default Welcome;
