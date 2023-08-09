import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_NFT } from "../../querys/getOneNft";
import { useParams } from "react-router-dom";
import { ButtonBuyNft } from "../../components/buttonBuyNft/ButtonBuyNft";
import handleBuyNft from "../../helpers/buyNft";
import { useLoadingContext } from "../../useContext/LoaderContext";
const NftInfo = () => {
  const [nft, setNft] = useState(null);
  const [getNft, { data, loading }] = useLazyQuery(GET_NFT);
  const { tokenId } = useParams();
  const { setTransactionIsLoading } = useLoadingContext();
  useEffect(() => {
    if (tokenId) {
      console.log(
        tokenId,
        "ESTE ES TOKEN y este su tipo",
        typeof Number(tokenId)
      );
      getNft({
        variables: {
          tokenId: Number(tokenId),
        },
      });
    }
  }, [tokenId]);

  useEffect(() => {
    if (data) {
      setNft(data.nft);
      console.log(data.nft, "DATA");
      console.log(nft, "NFT");
    }
  }, [data]);

  if (loading === true)
    return <p style={{ marginTop: "90px", color: "white" }}>Loading...</p>;

  if (!data || !nft) {
    return <p style={{ marginTop: "90px", color: "white" }}>Not found...</p>;
  }
  return (
    <div className="container_nft_info">
      <div className="content_nft_info">
        <div className="grid_item image_nft">
          <img src={nft?.image} alt="" />
        </div>

        <div className="grid_item name_sale">
          <div>
            <h1>{nft?.name}</h1>
            <p>{nft?.description}</p>
          </div>
          <div>
            <h1>Sale</h1>
            <p>{nft?.price}</p>
          </div>
        </div>
        <div className="grid_item nft_info">
          <h1>NFT information</h1>
          <ul>
            <li>Seller: {nft?.seller}</li>
            <li>Creator: {nft?.owner}</li>
            <li>Token ID: {nft?.tokenId}</li>
            <li>Total copies of this NFT: 1</li>
            <li>Amount remaining: 1</li>
            <li>Is Transferable: Yes</li>
          </ul>
        </div>
        <div className="grid_item create_nft">
          <h1>Create NFT</h1>
          <div className="table_nft_info">
            <div className="table_nft_row">
              <div className="table_nft_header">Característica</div>
              <div className="table_nft_header">Valor</div>
            </div>
            <div className="table_nft_row attack">
              <div className="table_nft_cell">Attack</div>
              <div className="table_nft_cell value">{nft?.attack}</div>
            </div>
            <div className="table_nft_row defense">
              <div className="table_nft_cell">Defense</div>
              <div className="table_nft_cell value">{nft?.defense}</div>
            </div>
            <div className="table_nft_row strength">
              <div className="table_nft_cell">Strength</div>
              <div className="table_nft_cell value">{nft?.strength}</div>
            </div>
            <div className="table_nft_row teamName">
              <div className="table_nft_cell">Team name</div>
              <div className="table_nft_cell value">{nft?.teamName}</div>
            </div>
          </div>
          <ButtonBuyNft className={"button_confirm_buy_nftinfo"} nft={nft} />
        </div>
        <div className="grid_item offers">
          <h1>Offers</h1>
          <h1>sda</h1>
        </div>
      </div>
    </div>
  );
};

export default NftInfo;
