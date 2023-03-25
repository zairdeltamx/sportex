import { Pagination } from "@mui/material";
import React from "react";
import "./styles.css";
export const PaginationInput = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const previous = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const next = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="containerPagination">
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => previous()}
          className="previousPagination"
        >
          {"<"} Previous
        </button>
      </div>
      <div>
        <span className="currentPagePagination">{currentPage}</span>
      </div>
      <div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => next()}
          className="nextPagination"
        >
          Next {">"}
        </button>
      </div>
    </div>
  );
};
