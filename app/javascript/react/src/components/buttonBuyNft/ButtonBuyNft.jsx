import React from "react";
import buyNFT from "../../helpers/buyNft";
import { notification } from "../alerts/notifications";

import { deleteNft } from "../../services/nft";

import { CODE_INSUFFICIENT_GAS } from "../../../../controllers/js/ethConfig";
import { useLoadingContext } from "../../useContext/LoaderContext";

export const ButtonBuyNft = ({ nft }) => {
  const { setTransactionIsLoading } = useLoadingContext()

  async function handleBuyNft(nft) {
    try {
      setTransactionIsLoading(true)
      await buyNFT(nft);
      await deleteNft({ id: nft.id });
      setTransactionIsLoading(false)

      notification.showSuccess({
        title: "Successful purchase",
        message: "Your NFT will be found in the My Assets section",
      });
    } catch (error) {
      setTransactionIsLoading(false)
      if (error.code === CODE_INSUFFICIENT_GAS) {

        notification.showWarning({
          title: "Failed to buy",
          message: "You don't have enough gas for this purchase",
        });
        return
      }
      notification.showError({
        title: "Failed to buy",
        message: "An error has occurred in the purchase, please try again",
      });
    } finally {
      setTransactionIsLoading(false)
    }
  }
  return (

    <button onClick={() => handleBuyNft(nft)} >
      BUY IT
    </button>

  );
};
