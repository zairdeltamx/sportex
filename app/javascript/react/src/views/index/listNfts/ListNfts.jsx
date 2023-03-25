import React from "react";
import { NftItem } from "../nftItem/NftItem";
import "./styles.css";
export const ListNfts = ({ nfts }) => {
  return (
    <div className="listNfts">
      {nfts.map((nft) => (
        <div key={nft.id}>
          <NftItem nft={nft} />
        </div>
      ))}
    </div>
  );
};
