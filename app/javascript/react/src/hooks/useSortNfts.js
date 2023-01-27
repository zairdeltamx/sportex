import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_NFTS } from "../querys/ALL_QUERYS";

export const useSortNfts = () => {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [nameFilter, setNameFilter] = useState("");
  const [getNfts, { data, loading, error }] = useLazyQuery(GET_NFTS);
  const [newPage, setNewPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  useEffect(() => {
    getNfts({ variables: { pageSearch: newPage } });
  }, [newPage]);

  useEffect(() => {
    if (data) {
      setTotalPages(data.getAllNfts.metadata.totalPages);
    }
  }, [data]);
  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortOrder = () => {
    setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
  };

  const handleNameFilter = (event) => {
    setNameFilter(event.target.value);
  };
  const handleSearch = (event) => {};

  return {
    sortBy,
    sortOrder,
    nameFilter,
    handleSortBy,
    handleSortOrder,
    handleNameFilter,
    newPage,
    totalPages,
    setNewPage,
    data,
  };
};
