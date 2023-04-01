import React, { useState, useEffect } from "react";
import { Pagination } from "../../../components";

import { Banner } from "../../../layouts/banner/banner";
import { ListNfts } from "../../../components/ListNfts";
import { SorterNfts } from "../sorterNfts/SorterNfts";
import { useLazyQuery } from "@apollo/client";
import { GET_NFTS } from "../../../querys/getAllNfts";
import { Wave } from "../../../components/Wave";
import "./styles.css";
import buyNFT from "../../../helpers/buyNft";
import { deleteNft } from "../../../services/nft";
import ActionCable from "actioncable";

export default function Index() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  const cable = ActionCable.createConsumer(`${protocol}//${host}/cable`);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("");
  const [teamName, setTeamName] = useState("");
  const [nfts, setNfts] = useState([]);
  const [getNFTs, { data, loading, error }] = useLazyQuery(GET_NFTS);

  useEffect(() => {
    const channel = cable.subscriptions.create("NftChannel", {
      room: "13",
      received: (data) => {
        console.log(data, "DAATASDS");
        handleSubmit();
      },
    });
    const channel1 = cable.subscriptions.create("NftChannel", {
      room: "13",
      received: (data) => {
        console.log(data, "DAATASDS");
        handleSubmit();
      },
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleSubmit = () => {
    console.log("ENTRA");
    getNFTs({
      variables: {
        page: currentPage,
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
  }, [currentPage, name]);

  useEffect(() => {
    if (data) {
      console.log("ENTRA2");
      setNfts(data.getAllNfts.collection);
      setTotalPages(data.getAllNfts.metadata.totalPages);
    }
  }, [data]);
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
            teamName={teamName}
            setTeamName={setTeamName}
          />

          {!nfts ? <h1>CARGANDO BRO</h1> : <ListNfts nfts={nfts} />}
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
