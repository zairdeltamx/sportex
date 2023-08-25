import React, { useState, useEffect } from 'react';
import { Pagination } from '../../components';
import { Banner } from '../../layouts/banner/Banner';
import { ListNfts } from '../../components/ListNfts';
import { Wave } from '../../components/Wave';
import styles from './index.module.css';
import { Loader } from '../../components/Loader';
import { SorterNfts } from './SorterNfts';

import { useGetNfts } from '../../graphql/nft/custom-hooks';
import {
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import { MARK_AS_SOLD } from '../../graphql/nft/graphql-mutations';
import { GET_NFTS } from '../../graphql/nft/graphql-queries';
import { useGraphqlContext } from '../../useContext/GraphqlContext';
import fetchCryptoPrice from '../../services/cryptoPrice';

export default function Index() {
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

  console.log(data, 'DATA');

  const nfts = data?.allNFTs.nfts || []; // Access nfts collection from data
  console.log(data?.allNFTs, 'PAGES');
  const nftsWithPriceInUSD = nfts.map((nft) => ({
    ...nft,
    priceInUSD: cryptoPrice
      ? Number((cryptoPrice * nft.price).toFixed(2))
      : null,
  }));

  const mark = () => {
    markSold({
      variables: { id: 30 },
      // Realizar refetch manualmente sin proporcionar las variables
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
            <ListNfts isMarketplace={true} nfts={nftsWithPriceInUSD} />
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
}
