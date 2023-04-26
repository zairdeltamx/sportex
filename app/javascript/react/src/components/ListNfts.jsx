import React, { useEffect, useState } from "react";
import { NftItem } from "./NftItem";
export const ListNfts = ({ nfts }) => {
  const [unitDolar, setUnitDolar] = useState(0);
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => {
        const avalanchePrice = data["binancecoin"]["usd"];
        setUnitDolar(avalanchePrice);
      });
  }, []);
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
