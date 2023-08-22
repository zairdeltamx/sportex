import React from 'react';
import delistNft from '../helpers/delistNft';
import { notification } from './alerts/notifications';
import styles from './ButtonDelistNft.module.css';
import { useLoadingContext } from '../useContext/LoaderContext';

import { useMarkAsSold } from '../graphql/nft/custom-hooks';
import { GET_NFTS } from '../graphql/nft/graphql-queries';

export const ButtonDelistNft = ({ nft }) => {
  const { setTransactionIsLoading } = useLoadingContext();
  const { markNftAsSold, loading, error, data } = useMarkAsSold();
  async function handleDelistNft(nft) {
    try {
      setTransactionIsLoading(true);
      // console.log('ENTRA AQUI LIST');
      await delistNft(nft);
      const { data } = await markNftAsSold({
        variables: { token_id: nft.tokenId },
        refetchQueries: [{ query: GET_NFTS }],
      });

      // console.log(data, 'DATA');

      if (data && data.markAsSold) {
        notification.showSuccess({
          title: 'Unlisted successfully',
          message: `The NFT with the name ${data.markAsSold.name} has been successfully delisted.`,
        });
      }
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
