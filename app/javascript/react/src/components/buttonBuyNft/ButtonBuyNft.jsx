import React from "react";
import buyNFT from "../../helpers/buyNft";
import './styles.css'
export const ButtonBuyNft = ({ nft }) => {
  return (
    <div>
      <button className="buttonBuyNft" onClick={() => buyNFT(nft)}>BUY IT</button>
    </div>
  );
};
