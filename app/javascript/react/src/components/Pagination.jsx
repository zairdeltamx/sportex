import React from "react";
import styles from "./Pagination.module.css";

export const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
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
    <div className={styles.container}>
      <div>
        <button
          disabled={currentPage === 1}
          onClick={previous}
          className={styles.previous}
        >
          {"<"} Previous
        </button>
      </div>
      <div>
        <span className={styles.currentPage}>{currentPage}</span>
      </div>
      <div>
        <button
          disabled={currentPage === totalPages}
          onClick={next}
          className={styles.next}
        >
          Next {">"}
        </button>
      </div>
    </div>
  );
};
