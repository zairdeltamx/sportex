import React, { useState, useEffect } from "react";
import { Banner } from "../../layouts/banner/banner";

import { Loading, PaginationInput } from "../../components";
import {
  ContainerPagination,
  Paragraph,
  Title,
} from "../../components/elements/Elements";
import { Nfts } from "./Nfts";
import { SorterNfts } from "./SorterNfts";
import { useLazyQuery } from "@apollo/client";
import { GET_NFT } from "../../querys/ALL_QUERYS";

export const ControlNfts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [name, setName] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("");

  const [getNFTs, { data, loading, error }] = useLazyQuery(GET_NFT);
  const handleSubmit = (e) => {
    getNFTs({
      variables: {
        page:currentPage,
        limit:limitPerPage,
        name,
        orderBy,
        order,
      },
    });
  };

  useEffect(() => {
    handleSubmit();
  }, [currentPage]);

  return (
    <div>
      <SorterNfts
        handleSubmit={handleSubmit}
        order={order}
        setOrder={setOrder}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        setName={setName}
        name={name}
      />

      {data ? (
        data.getAllNfts.collection.length === 0 ? (
          <h1 style={{ color: "white" }}>Not found</h1>
        ) : (
          <div>
            <Nfts nfts={data.getAllNfts.collection} />
          </div>
        )
      ) : (
        <Loading />
      )}
      <ContainerPagination>
        <Paragraph>Page: {currentPage}</Paragraph>
        <PaginationInput
          handleChange={(event, value) => {
            setCurrentPage(value);
          }}
          page={currentPage}
          pages={data ? data.getAllNfts.metadata.totalPages : 1}
        ></PaginationInput>
      </ContainerPagination>
    </div>
  );
};
