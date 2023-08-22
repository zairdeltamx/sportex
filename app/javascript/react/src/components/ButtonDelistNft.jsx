import React from 'react';
import delistNft from '../helpers/delistNft';
import { notification } from './alerts/notifications';
import styles from './ButtonDelistNft.module.css';
import { useLoadingContext } from '../useContext/LoaderContext';

import { useMarkAsSold } from '../graphql/nft/custom-hooks';

export const ButtonDelistNft = ({ nft }) => {
  const { setTransactionIsLoading } = useLoadingContext();
  const [markNftAsSold] = useMarkAsSold();
  async function handleDelistNft(nft) {
    try {
      setTransactionIsLoading(true);
      console.log('ENTRA AQUI LIST');
      await delistNft(nft);
      markNftAsSold({ variables: { tokenId: nft.tokenId } });
      notification.showSuccess({
        title: 'Unlisted successfully',
        message: 'Your NFT will be found in the My Assets section',
      });
    } catch (error) {
      console.log('ERROROR', error);
      notification.showError({
        title: 'Failed to unlist',
        message: 'There was an error unlisting NFT, please try again later',
      });
    } finally {
      setTransactionIsLoading(false);
    }
  }
  return (
    <button
      className={styles.buttonDelist}
      onClick={() => handleDelistNft(nft)}
    >
      Delist
    </button>
  );
};
