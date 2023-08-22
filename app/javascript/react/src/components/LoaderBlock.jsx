import React from "react";
import styles from "./LoaderBlock.module.css";

export const LoaderBlock = () => {
  return (
    <>
      <div className={styles.loaderBlock}>
        <div>
          <div className={styles.loaderMessage}>
            <h1>Waiting confirmation...</h1>
          </div>
          <div className={styles.loader}>
            <div className={styles.ball}></div>
            <div className={styles.ball}></div>
            <div className={styles.ball}></div>
          </div>
        </div>
      </div>
    </>
  );
};
