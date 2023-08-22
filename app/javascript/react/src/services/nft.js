import axios from 'axios';
import { getApiUrl } from '../config';
import { useLazyQuery } from '@apollo/client';
import { MARK_AS_SOLD } from '../graphql/nft/graphql-mutations';

export const deleteNft = async ({ id }) => {
  const [markAsSold, { data, loading, error }] = useLazyQuery(MARK_AS_SOLD);

  console.log(id, 'ID');
  console.log(typeof id);

  await markAsSold({
    variables: {
      tokenId: id,
    },
  });
  return {
    data,
    error,
  };
};

export const checkStatusNft = async ({ id }) => {
  console.log(id, 'DATIS');
  try {
    const apiUrl = getApiUrl(`nfts/${id}/status`);
    const response = await axios.get(apiUrl);
    console.log(response.data, 'DATA');
    return response.data.json.status;
  } catch (error) {
    // Manejo de errores
    console.error('Error al verificar el estado del NFT:', error);
    throw error;
  }
};
