import React, { useState, useEffect } from 'react';
import { Pagination } from '../../components';
import { Banner } from '../../layouts/banner/Banner';
import { ListNfts } from '../../components/ListNfts';
import { Wave } from '../../components/Wave';
import styles from './index.module.css';
import { Loader } from '../../components/Loader';
import { useMetamask } from '../../useContext/MetamaskContext';
import { SorterNfts } from './SorterNfts';
import { useGetNfts } from '../../graphql/nft/custom-hooks';

export default function Index() {
  const { addressMetamask } = useMetamask();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('');
  const [teamName, setTeamName] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [searchForSeller, setsearchForSeller] = useState(false);
  const [getNfts, { loading, data, error, refetch }] = useGetNfts();

  const fetchNFTsData = () => {
    getNfts({
      variables: {
        page: currentPage,
        name,
        seller: searchForSeller === true ? addressMetamask : '',
        limit: 2,
        order,
        orderBy,
        teamName,
      },
    });
  };

  useEffect(() => {
    fetchNFTsData();
  }, [currentPage, name, searchForSeller]);

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

  const nfts = data?.nfts.collection || []; // Access nfts collection from data

  // Calculate priceInUSD for each NFT and add it to the NFT objects
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
            setCurrentPage={setCurrentPage}
            setOrder={setOrder}
            fetchNFTsData={fetchNFTsData}
            searchForSeller={searchForSeller}
            setsearchForSeller={setsearchForSeller}
            setName={setName}
            setOrderBy={setOrderBy}
            setTeamName={setTeamName}
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
