import React from "react";

import { ListNfts } from "../../components/ListNfts";

import { Wave } from "../../components/Wave";
import { Loader } from "../../components/Loader";
import useNFTs from "../../helpers/loadNfts";

export default function MyAssets() {
  const [nfts, loadingState] = useNFTs();

  return (
    <div style={{ marginTop: "80px" }}>
      <Wave />
      <div className="container_my_assets">
        <div className="content_my_assets">
          <h1>My assets</h1>
          {loadingState ? (
            <Loader />
          ) : nfts.length === 0 ? (
            <h1 style={{ textAlign: "center", paddingTop: "20px" }}>
              Not found NFTs
            </h1>
          ) : (
            <ListNfts nfts={nfts} />
          )}
        </div>
      </div>
    </div>
  );
}
