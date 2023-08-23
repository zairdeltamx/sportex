import React, { useState, useEffect } from 'react';
import { Pagination } from '../../components';
import { Banner } from '../../layouts/banner/Banner';
import { ListNfts } from '../../components/ListNfts';
import { Wave } from '../../components/Wave';
import styles from './index.module.css';
import { Loader } from '../../components/Loader';
import { SorterNfts } from './SorterNfts';

import { useGetNfts } from '../../graphql/nft/custom-hooks';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { MARK_AS_SOLD } from '../../graphql/nft/graphql-mutations';
import { GET_NFTS } from '../../graphql/nft/graphql-queries';
import { useGraphqlContext } from '../../useContext/GraphqlContext';

export default function Index() {
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { setVariables } = useGraphqlContext();
  const { loading, data, error, refetch } = useGetNfts({ page: currentPage });
  useEffect(() => {
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    )
      .then((res) => res.json())
      .then((data) => {
        const bnbPrice = data['binancecoin']['usd'];
        setCryptoPrice(bnbPrice);
      });
  }, []);

  useEffect(() => {
    setVariables({ page: currentPage });
  }, [currentPage]);

  console.log(data, 'DATA');

  const nfts = data?.nfts.collection || []; // Access nfts collection from data

  const nftsWithPriceInUSD = nfts.map((nft) => ({
    ...nft,
    priceInUSD: cryptoPrice
      ? Number((cryptoPrice * nft.price).toFixed(2))
      : null,
  }));

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
          ) : (
            <ListNfts isMarketplace={true} nfts={nftsWithPriceInUSD} />
          )}
          <Pagination
            totalPages={data?.nfts.metadata.totalPages || 1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></Pagination>
        </div>
      </div>
    </div>
  );
}
