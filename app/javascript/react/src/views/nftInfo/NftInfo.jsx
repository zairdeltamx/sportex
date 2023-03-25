import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_NFT } from "../../querys/getOneNft";
import { useParams } from "react-router-dom";
import buyNFT from "../../helpers/buyNft";
import "./styles.css";
const NftInfo = () => {
  const [nft, setNft] = useState(null);
  const [getNft, { data, loading }] = useLazyQuery(GET_NFT);

  const { id } = useParams();
  useEffect(() => {
    getNft({
      variables: {
        id: 1,
      },
    });
  }, []);

  useEffect(() => {
    if (data) {
      //   console.log(data, "DATA");
      setNft(data.getOneNft);
      console.log(data, "NFT");
    }
  }, [data]);

  if (nft === null || loading === true) return <p>Loading...</p>;
  console.log("NO PASAAA");
  return (
    <div className="parent">
      <div className="div1">
        <img src={nft.image} alt="" />
      </div>
      <div className="div2">
        <div>
          <h1>{nft.name}</h1>
          <p>{nft.description}</p>
        </div>
        <div>
          <h1>Sale</h1>
          <p>{nft.price}</p>
        </div>
      </div>
      <div className="div3">
        <div>
          <h1>NFT information</h1>
          <ul>
            <li>Seller: {nft.seller}</li>
            <li>Creator: {nft.owner}</li>
            <li>Token ID: {nft.tokenId}</li>
            <li>Total copies of this NFT: 1</li>
            <li>Amount remaining: 1</li>
            <li>Is Transferable: Yes</li>
          </ul>
        </div>
      </div>
      <div className="div4">
        <h1>Create NFT</h1>
        <button>Buy NFT</button>
      </div>
      <div className="div5">
        <h1>Offers</h1>
      </div>
    </div>
  );
};

export default NftInfo;
