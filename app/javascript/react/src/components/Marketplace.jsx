import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { GET_NFTS } from '../graphql/querys/getAllNfts';

export const Marketplace = ({
  currentPage,
  searchForSeller,
  addressMetamask,
}) => {
  const [nfts, setNfts] = useState([]);
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [getNFTs, { data, loading, error }] = useLazyQuery(GET_NFTS);

  useEffect(() => {
    getNFTs({
      variables: {
        page: currentPage,
        seller: searchForSeller === true ? addressMetamask : '',
        limit: 10,
        name,
        orderBy,
        order,
        teamName,
      },
      fetchPolicy: 'no-cache',
    });
  }, []);

  useEffect(() => {
    if (data) {
      setNfts(data.nfts.collection);
    }
  }, [data]);

  return (
    <>
      {nfts.map((nft) => (
        <h1>{nft.name}</h1>
      ))}
    </>
  );
};
