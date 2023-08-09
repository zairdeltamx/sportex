import React, { Fragment } from "react";
import { ButtonBuyNft } from "./buttonBuyNft/ButtonBuyNft";
import handleBuyNft from "../helpers/buyNft";
import { useLoadingContext } from "../useContext/LoaderContext";

export const ConfirmBuy = ({
  termsAccepted,
  setTermsAccepted,
  nft,
  setShowConfirmBuy,
}) => {
  const { setTransactionIsLoading } = useLoadingContext();

  return (
    <Fragment>
      <div className="overlay_confirm_buy"></div>
      <div className="container_confirm_buy">
        <h3>Terms and Conditions</h3>
        <label>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(ev) => setTermsAccepted(ev.target.checked)}
          />{" "}
          <a target="_blank" href="/terms">
            Accept terms and conditions
          </a>
        </label>
        <div>
          <button
            className="button_close_confirm"
            onClick={() => {
              setShowConfirmBuy(false);
            }}
          >
            Close
          </button>
          <button
            disabled={!termsAccepted}
            className="button_buy_nft_modal"
            onClick={() => handleBuyNft({ nft, setTransactionIsLoading })}
          >
            Confirm buy
          </button>
        </div>
      </div>
    </Fragment>
  );
};
