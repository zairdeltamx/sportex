import React from "react";
import styles from "./Loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.container}>
      <label className={styles.loadingTitle}>Loading ...</label>
      <span className={styles.loadingCircle + " " + styles.sp1}>
        <span className={styles.loadingCircle + " " + styles.sp2}>
          <span className={styles.loadingCircle + " " + styles.sp3}></span>
        </span>
      </span>
    </div>
  );
};
