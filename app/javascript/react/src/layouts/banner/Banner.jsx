import React from "react";
import imgBanner from "../../img/nftBanner.png";
import Nft from "../../img/NFT.svg";
import styles from "./banner.module.css";
export const Banner = () => {
  return (
    <div>
      <div className={styles.banner}>
        {" "}
        {/* Aplicar la clase de CSS Module */}
        <Nft className={styles.imgSvgNft} alt="Nft image" />
        <div className={styles.firstHalfBanner}>
          <div className={styles.contentTextBanner}>
            <h1>Discover, and collect Digital Players NFTs </h1>
            <p>
              NFT FIFA Is a card strategy game by turns, build your deck,
              customize your team and play on eve and pop mode to rise to the
              top
            </p>
            <button>
              <span>Play in SporteX</span>
            </button>
          </div>
        </div>
        <div className={styles.secondHalfBanner}>
          <div className={styles.containerBlur}>
            <div className={styles.textsContainerBlur}>
              <div>
                <div className={styles.textBlur}>
                  <h1>98+</h1>
                  <p>Players</p>
                </div>
                <div className={styles.textBlur}>
                  <h1>12k+</h1>
                  <p>NFTs</p>
                </div>
                <div className={styles.textBlur}>
                  <h1>15K+</h1>
                  <p>Artists</p>
                </div>
              </div>
            </div>
            <img className={styles.imgBannerNft} src={imgBanner} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
