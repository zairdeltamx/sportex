import React from 'react';
import delistNft from '../helpers/delistNft';
import { notification } from './alerts/notifications';
import styles from './ButtonDelistNft.module.css';
import { useLoadingContext } from '../useContext/LoaderContext';

import { useMarkAsSold } from '../graphql/nft/custom-hooks';
import { GET_NFTS } from '../graphql/nft/graphql-queries';
import { useGraphqlContext } from '../useContext/GraphqlContext';

export const ButtonDelistNft = ({ nft }) => {
  const { setTransactionIsLoading } = useLoadingContext();
  const [markNftAsSold, { loading, error, data }] = useMarkAsSold();
  const { variables, currentPage, setCurrentPage } = useGraphqlContext();

  async function handleDelistNft(nft) {
    try {
      setTransactionIsLoading(true);
      await delistNft(nft);

      // console.log(variables, 'VARIABLES');
      const { data } = await markNftAsSold({
        variables: { id: Number(nft.id) },
        refetchQueries: [
          {
            query: GET_NFTS,
            variables: { page: currentPage, ...variables },
          },
        ],
      });
      setCurrentPage(1);
      console.log(data, 'DATA');

      if (data && data.markNftAsSold) {
        notification.showSuccess({
          title: 'Unlisted successfully',
          message: `The NFT with the name ${data.markNftAsSold.name} has been successfully delisted.`,
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
