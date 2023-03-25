import React, { useState, useEffect } from "react";
import { PaginationInput } from "../../../components";

import { Banner } from "../../../layouts/banner/banner";
import { ListNfts } from "../listNfts/ListNfts";
import { SorterNfts } from "../sorterNfts/SorterNfts";
import { useLazyQuery } from "@apollo/client";
import { GET_NFTS } from "../../../querys/getAllNfts";
import { Wave } from "../../../components/wave/Wave";
import "./styles.css";
export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("");
  const [teamName, setTeamName] = useState("");
  const [nfts, setNfts] = useState([]);
  const [getNFTs, { data, loading, error }] = useLazyQuery(GET_NFTS);
  const handleSubmit = () => {
    console.log("ENTRA");
    getNFTs({
      variables: {
        page: currentPage,
        limit: 1,
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
  }, [currentPage]);

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
      {/* <h1 style={{ textAlign: "center" }}>NFTS MARKETPLACE</h1> */}
      <div className="contentIndex">
        <div className="containerIndex">
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
          <PaginationInput
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></PaginationInput>
        </div>
      </div>
    </div>
  );
}
