import React, { useEffect, useState } from "react";
import { NftItem } from "./NftItem";
export const ListNfts = ({ nfts, unitDolar }) => {
  return (
    <div className="list_nfts">
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          <NftItem nft={nft} unitDolar={unitDolar} />
        </div>
      ))}
    </div>
  );
};
