import React, { useState, useEffect } from "react";
import { Pagination } from "../../../components";

import { Banner } from "../../../layouts/banner/banner";
import { ListNfts } from "../../../components/ListNfts";
import { SorterNfts } from "../sorterNfts/SorterNfts";
import { useLazyQuery } from "@apollo/client";
import { GET_NFTS } from "../../../querys/getAllNfts";
import { Wave } from "../../../components/Wave";
import "./styles.css";
import { Loader } from "../../../components/Loader";
import ActionCable from "actioncable";
import { useMetamask } from "../../../useContext/MetamaskContext";

export default function Index() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  const cable = ActionCable.createConsumer(`${protocol}//${host}/cable`);

  const { addressMetamask } = useMetamask();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("");
  const [teamName, setTeamName] = useState("");
  const [nfts, setNfts] = useState([]);
  const [getNFTs, { data, loading, error }] = useLazyQuery(GET_NFTS);
  const [unitDolar, setUnitDolar] = useState(0);
  const [searchForSeller, setsearchForSeller] = useState(false);
  const handleSubmit = () => {
    console.log("====================================");
    console.log(addressMetamask);
    console.log("====================================");
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
      setNfts(data.nfts.collection);
      console.log(data.nfts);
      setTotalPages(data.nfts.metadata.totalPages);
    }
  }, [data]);
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => {
        const avalanchePrice = data["binancecoin"]["usd"];
        setUnitDolar(avalanchePrice);
      });
  }, []);
  useEffect(() => {
    const channel = cable.subscriptions.create("NftChannel", {
      room: "13",
      received: (data) => {
        handleSubmit();
      },
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      <Banner />
      <Wave />
      <div className="containerIndex">
        <div className="contentIndex">
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

          {loading || !unitDolar ? (
            <Loader />
          ) : nfts.length === 0 ? (
            <h1 style={{ textAlign: "center", paddingTop: "20px" }}>
              Not found NFTs
            </h1>
          ) : (
            <ListNfts nfts={nfts} unitDolar={unitDolar} />
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
