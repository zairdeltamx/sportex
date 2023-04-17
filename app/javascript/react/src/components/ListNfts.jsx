import React from "react";
import { NftItem } from "./NftItem";
export const ListNfts = ({ nfts }) => {
  console.log(nfts, "nfts");
  return (
    <div className="list_nfts">
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          <NftItem nft={nft} />
        </div>
      ))}
    </div>
  );
};
