import React, { useState, useEffect } from "react";
import { Pagination } from "../../components";

import { Banner } from "../../layouts/banner/Banner";
import { ListNfts } from "../../components/ListNfts";
import { useLazyQuery } from "@apollo/client";
import { GET_NFTS } from "../../querys/getAllNfts";
import { Wave } from "../../components/Wave";
import styles from "./index.module.css";
import { Loader } from "../../components/Loader";
import { useMetamask } from "../../useContext/MetamaskContext";
import { SorterNfts } from "./SorterNfts";

export default function Index() {
  const { addressMetamask } = useMetamask();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("");
  const [teamName, setTeamName] = useState("");
  const [nfts, setNFTs] = useState([]);
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [getNFTs, { data, loading, error }] = useLazyQuery(GET_NFTS);
  const [searchForSeller, setsearchForSeller] = useState(false);
  const handleSubmit = () => {
    getNFTs({
      variables: {
        page: currentPage,
        seller: searchForSeller === true ? addressMetamask : "",
        limit: 10,
        name,
        orderBy,
        order,
        teamName,
      },
      fetchPolicy: "no-cache",
    });
  };

  useEffect(() => {
    handleSubmit();
  }, [currentPage, name, searchForSeller]);

  useEffect(() => {
    if (data) {
      setNFTs(data.nfts.collection);
      const nfts = data.nfts.collection;
      if (cryptoPrice) {
        const updatedNFTs = nfts.map((nft) => ({
          ...nft,
          priceInUSD: Number((cryptoPrice * nft.price).toFixed(2)),
        }));
        console.log(updatedNFTs, "SKDJAKLDJALDJSLKDAJKLDS");
        setNFTs(updatedNFTs);
      }

      console.log(data.nfts);
      setTotalPages(data.nfts.metadata.totalPages);
    }
  }, [data, cryptoPrice]);

  useEffect(() => {
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    )
      .then((res) => res.json())
      .then((data) => {
        const bnbPrice = data["binancecoin"]["usd"];
        setCryptoPrice(bnbPrice);
      });
  }, []);

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
            handleSubmit={handleSubmit}
            order={order}
            setOrder={setOrder}
            setOrderBy={setOrderBy}
            orderBy={orderBy}
            setName={setName}
            name={name}
            setsearchForSeller={setsearchForSeller}
            setTeamName={setTeamName}
          />

          {loading ? (
            <Loader />
          ) : nfts.length === 0 ? (
            <h1 style={{ textAlign: "center", paddingTop: "20px" }}>
              Not found NFTs
            </h1>
          ) : (
            <ListNfts isMarketplace={true} nfts={nfts} />
          )}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></Pagination>
        </div>
      </div>
    </div>
  );
}
