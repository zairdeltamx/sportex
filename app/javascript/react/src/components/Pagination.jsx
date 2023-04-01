import React from "react";
export const Pagination = ({
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
    <div className="container_pagination">
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => previous()}
          className="previous_pagination"
        >
          {"<"} Previous
        </button>
      </div>
      <div>
        <span className="current_page_pagination">{currentPage}</span>
      </div>
      <div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => next()}
          className="next_pagination"
        >
          Next {">"}
        </button>
      </div>
    </div>
  );
};
