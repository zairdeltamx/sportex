import { Pagination } from "@mui/material";
import React from "react";

export const PaginationInput = ({ handleChange, page, pages }) => {
  return (
    <Pagination
      color="primary"
      style={{ background: "white" }}
      onChange={handleChange}
      page={page}
      count={pages}
    />
  );
};
