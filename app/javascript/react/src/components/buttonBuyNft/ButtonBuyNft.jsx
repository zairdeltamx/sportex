import React, { Fragment, useState } from "react";

import { ConfirmBuy } from "../ConfirmBuy";

export const ButtonBuyNft = ({ nft, className }) => {
  const [showConfirmBuy, setShowConfirmBuy] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  return (
    <Fragment>
      <button
        className={className}
        onClick={() => {
          setShowConfirmBuy(true);
        }}
      >
        BUY IT
      </button>
      {showConfirmBuy && (
        <ConfirmBuy
          nft={nft}
          termsAccepted={termsAccepted}
          setShowConfirmBuy={setShowConfirmBuy}
          setTermsAccepted={setTermsAccepted}
        />
      )}
    </Fragment>
  );
};
