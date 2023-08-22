import React, { useState } from "react";
import MetamaskLogo from "../img/Metamask.svg";
import { LoaderBlock } from "./LoaderBlock";
import styles from "./ModalMetamaskInstall.module.css";

export const ModalMetamaskInstall = () => {
  const [activeModal, setActiveModal] = useState(true);

  return (
    <div
      className={`${styles.container} ${
        !activeModal ? styles.activeModal : ""
      }`}
    >
      <div
        onClick={() => setActiveModal(false)}
        className={styles.closeModalMetamask}
      >
        <span>Cerrar X</span>
      </div>
      <div className={styles.contentModal}>
        <MetamaskLogo />
        <h1>You need to login with MetaMask</h1>
        <p>It seems you don't have MetaMask installed</p>
        <button>
          <a target="_blank" href="https://metamask.io/download/">
            Install MetaMask
          </a>
        </button>
      </div>
    </div>
  );
};
