import React from "react";
import imgBanner from "../../img/nftBanner.png";
import Nft from "../../img/NFT.svg";
export const Banner = () => {
  return (
    <div>
      <div className="banner">
        <Nft className="imgSvgNft" alt="Nft image" />
        <div className="firstHalfBanner">
          <div className="contentTextBanner">
            <h1>Discover, and collect Digital Players NFTs </h1>{" "}
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
        <div className="secondHalfBanner">
          <div className="containerBlur">
            <div className="texts_container_blur">
              <div>
                <div className="text_blur">
                  <h1>98+</h1>
                  <p>Players</p>
                </div>
                <div className="text_blur">
                  <h1>12k+</h1>
                  <p>NFTs</p>
                </div>
                <div className="text_blur">
                  <h1>15K+</h1>
                  <p>Artists</p>
                </div>
              </div>
            </div>
            <img className="imgBannerNft" src={imgBanner} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
