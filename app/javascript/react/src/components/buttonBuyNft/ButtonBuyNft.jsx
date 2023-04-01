import React from "react";
import buyNFT from "../../helpers/buyNft";
export const ButtonBuyNft = ({ nft }) => {
  return (

    <button className="buttonBuyNft" onClick={() => buyNFT(nft)}>
      BUY IT
    </button>

  );
};
