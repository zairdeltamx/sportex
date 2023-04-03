import React from "react";
import buyNFT from "../../helpers/buyNft";
export const ButtonBuyNft = ({ nft, handleBuy }) => {
  return (

    <button className="buttonBuyNft" onClick={() => handleBuy(nft)}>
      BUY IT
    </button>

  );
};
